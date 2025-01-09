const blockModel = require('../models/blockModel');

const latestBlock = async (req, res) => {
    try {
        const { latest_block_details, latest_block_number } = await blockModel.latestBlock();
        console.log(latest_block_number);
        res.status(201).json({ latest_block_details });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const nLatestBlocks = async (req, res) => {
    try {
        const { n } = req.body;
        if (!n || typeof n !== 'number' || n <= 0) {
            return res.status(400).json({ error: "'n' must be a positive number." });
        }
        const { blockDetails } = await blockModel.nLatestBlocks(n);
        if (!blockDetails || blockDetails.length === 0) {
            return res.status(404).json({ message: "No blocks found." });
        }
        res.status(201).json({ blockDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    latestBlock,
    nLatestBlocks
}

