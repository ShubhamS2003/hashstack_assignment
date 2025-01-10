const blockModel = require('../models/blockModel');

// Send http request to fetch the latest block
const latestBlock = async (req, res) => {
    try {
        const { latest_block_details, latest_block_number } = await blockModel.latestBlock();
        console.log(latest_block_number);
        res.status(201).json({ latest_block_details });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Send http request to fetch the 'n' latest blocks

const nLatestBlocks = async (req, res) => {
    try {
        const { n } = req.body;
        if (!n || typeof n !== 'number' || n <= 0) {
            return res.status(400).json({ error: "'n' must be a positive number." });
        }
        const {latestBlocks} = await blockModel.nLatestBlocks(n);
        if (!latestBlocks || latestBlocks.length === 0) {
            return res.status(404).json({ message: "No blocks found." });
        }

        const sanitizedBlocks = latestBlocks.map((block) => ({
            ...block,
            block_number: block.block_number.toString(),
            total: block.total.toString(),
            fees: block.fees.toString(),
            size: block.size.toString(),
            n_tx: block.n_tx.toString()
        }));

        res.status(200).json({ latestBlocks: sanitizedBlocks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    latestBlock,
    nLatestBlocks
}

