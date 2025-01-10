const axios = require('axios');
require('dotenv').config();

const BLOCKCYPHER_BASE_URL = process.env.BLOCKCYPHER_BASE_URL

const prismaClient = require('../../lib/db')

// Fetch the height(latest_block_number) from the blockcypher API and then use it fetch the details of the latest block
const base_url = `https://api.blockcypher.com/v1/eth/main`;

const latestBlock = async () => {
    try {
        // fetching the latest block number...
        const latestBlockData = await axios.get(`${base_url}`);
        const latest_block_number = latestBlockData.data.height;
        // fetching the block details using the block number
        const url = `${base_url}/blocks/${latest_block_number}`;
        const { data: latest_block } = await axios.get(url);
        const latest_block_details = {
            block_number: latest_block.height,
            name: latest_block.chain,
            hash: latest_block.hash,
            time: latest_block.received_time,
            total: latest_block.total,
            fees: latest_block.fees,
            size: latest_block.size,
            n_tx: latest_block.n_tx
        }
        return {
            latest_block_details,
            latest_block_number
        }
    } catch (error) {
        console.error('Error fetching the latest block:', error.message);
        throw new Error('Failed to fetch the latest block details.');
    }
}

const nLatestBlocks = async (n) => {
    try {
        // fetch the latest block number in the database. It is also the latest block on chain since we are constantly updating the databse
        const latest_block_number = await prismaClient.blocks.findFirst({
            orderBy: {
                block_number: "desc"
            },
            select: {
                block_number: true
            }
        });
        let latestBlocks = []
        // check if the database has enough entries then fetch the blocks from the database directly
        const blockCount = await prismaClient.blocks.count();
        if (blockCount >= n) {
            console.log("Fetching from database...");
            latestBlocks = await prismaClient.blocks.findMany({
                orderBy: {
                    block_number: "desc"
                },
                take: n
            });
            return {latestBlocks}
        }

        // incase we want to fetch more blocks than present in the database we pull all the entries from the database and send api calls for the rest

        console.log("Fetching block details...");
        const blocksFromDB = await prismaClient.blocks.findMany({
            orderBy: {
                block_number: "desc"
            },
        });
        latestBlocks = [...blocksFromDB];
        for (let i = blockCount; i < n; i++) {
            let current_block_number = latest_block_number.block_number - i;
            try {
                const url = `${base_url}/blocks/${current_block_number}`;
                const { data: latest_block_details } = await axios.get(url);
                latestBlocks.push({
                    block_number: BigInt(latest_block_details.height),
                    name: latest_block_details.chain,
                    hash: latest_block_details.hash,
                    time: latest_block_details.received_time,
                    total: BigInt(latest_block_details.total),
                    fees: BigInt(latest_block_details.fees),
                    size: BigInt(latest_block_details.size),
                    n_tx: BigInt(latest_block_details.n_tx)
                });
            } catch (error) {
                console.error(`Error fetching block ${current_block_number}`, error.message);
            }
        }
        return {latestBlocks};
    } catch (error) {
        console.error('Error fetching block details: ', error.message);
        throw new Error('Failed to fetch the block details');
    }
}

module.exports = {
    latestBlock,
    nLatestBlocks
};