const blockModel = require('./models/blockModel');
const prismaClient = require('../lib/db');
const { axios } = require('axios');
require('dotenv').config();

const BLOCKCYPHER_BASE_URL = process.env.BLOCKCYPHER_BASE_URL
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID

// Initiate the websocket connection

const { Web3 } = require('web3');
const provider = new Web3.providers.WebsocketProvider(
    `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
    {
        clientConfig: {
            keepalive: true,
            keepaliveInterval: 60000,
        },
        reconnect: {
            auto: true,
            delay: 5000,
            maxAttempts: 5,
            onTimeout: false,
        },
    }
);

provider.on("connect", () => {
    console.log("Websocket connected.");
});

provider.on("close", (event) => {
    console.log(event);
    console.log("Websocket closed.");
});

provider.on("error", (error) => {
    console.error("Websocket error:", error.message);
});

const web3 = new Web3(provider);

// Subscribe to newBlockHeaders channel for real time updates on the mined blocks

async function fetchLatestBlock() {
    try {
        console.log("Fetching blocks...")
        const subscription = await web3.eth.subscribe("newBlockHeaders");
        console.log(`${subscription.id}`);
        subscription.on("data", async (blockHeader) => {
            try {
                const block = await web3.eth.getBlock(blockHeader.number);
                // console.log({ number: block.number });
                await prismaClient.blocks.create({
                    data: {
                        block_number: block.number,
                        name: "Eth.main",
                        hash: block.hash,
                        time: new Date(Number(block.timestamp * BigInt(1000))),
                        total: BigInt(0),
                        fees: block.baseFeePerGas || 0,
                        size: block.size || 0,
                        n_tx: block.transactions.length || 0
                    }
                })
                console.log("WSS Block stored");
            } catch (blockError) {
                console.error("Error storing block details:", blockError.message);
            }
        });

        subscription.on("error", (error) => {
            console.error("Subscription error:", error.message);
        });

    } catch (error) {
        console.error("Error fetching latest block:", error.message);
    }
};

// Fetch and store the latest blocks into the database using the block number

async function fetchAndStoreBlocks(blockNumber) {
    try {
        const block = await web3.eth.getBlock(blockNumber);
        await prismaClient.blocks.create({
            data: {
                block_number: block.number,
                name: "Eth.main",
                hash: block.hash,
                time: new Date(Number(block.timestamp * BigInt(1000))),
                total: BigInt(0),
                fees: block.baseFeePerGas || 0,
                size: block.size || 0,
                n_tx: block.transactions.length || 0
            }
        });
        console.log("Block stored");
    } catch (error) {
        console.error(`Error in storing block ${blockNumber}`, error.message);
    }
}

// Update the database with the latest blocks everytime the server is turned on

const storeBlockDetails = async () => {
    try {

        let current_block = await prismaClient.blocks.findFirst({
            orderBy: {
                block_number: "desc"
            },
            select: {
                block_number: true
            }
        });

        const { latest_block_details, latest_block_number } = await blockModel.latestBlock();

        // If the database is empty initially fetch the 5 latest blocks (We can't fetch 100 blocks because the rate limit on BlockCypher is 100 req/hr)

        if (current_block === null) {
            console.log("Database empty. Fetching the 25 latest blocks from Etherium mainnet");
            for (let i = 4; i >= 0; i--) {
                let blockNumber = latest_block_number - i;
                console.log(latest_block_number);
                console.log(blockNumber);
                try {
                    await fetchAndStoreBlocks(blockNumber);
                } catch (error) {
                    console.error(`Error in storing block ${blockNumber}: `, error.message);
                }
            }
        } 

        // If the database has entries when we turn the server on, fetch only the freshly mined blocks

        else {
            console.log("Fetching the missing blocks from Etherium mainnet")
            let current_block_number = current_block.block_number;
            while (current_block_number < latest_block_number) {
                current_block_number++;
                try {
                    await fetchAndStoreBlocks(current_block_number);
                } catch (error) {
                    console.error(`Error in storing block ${current_block_number}`, error.message);
                }
            }
        }
    } catch (error) {
        console.error("Error in storing block: ", error.message);
    }
}

module.exports = {
    storeBlockDetails,
    fetchLatestBlock
}
