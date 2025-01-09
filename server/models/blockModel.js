// require('dotenv').config({ path: '../../.env'})
const axios = require('axios');
const { propfind } = require('../routes/blockRoutes');
// const { API_KEY } = process.env;

// Fetch the height(latest_block_number) from the blockcypher API and then use it fetch the details of the latest block
const base_url = `https://api.blockcypher.com/v1/eth/main`;

const latestBlock = async () => {
    try {
        const latestBlockData = await axios.get(`${base_url}`);
        const latest_block_number = latestBlockData.data.height;
        const url = `${base_url}/blocks/${latest_block_number}`;
        const { data: latest_block_details } = await axios.get(url);
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
        const latestBlockData = await axios.get(`${base_url}`);
        const latest_block_number = latestBlockData.data.height;
        const blockDetails = [];
        for (let i = 0; i < n; i++) {
            current_block_number = latest_block_number - i;
            const url = `${base_url}/blocks/${current_block_number}`;
            const { data: latest_block_details } = await axios.get(url);
            blockDetails.push(latest_block_details.height);
        }
        return {blockDetails};
    } catch (error) {
        console.error('Error fetching block details: ', error.message);
        throw new Error('Failed to fetch the block details');
    }
}

module.exports = {
    latestBlock,
    nLatestBlocks
};