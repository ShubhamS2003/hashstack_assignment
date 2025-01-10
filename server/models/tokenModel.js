const axios = require('axios');
const prismaClient = require('../../lib/db')

require('dotenv').config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

// Fetch token information from Etherscan api

const tokenInfo = async (address) => {
    try {
        const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=${address}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
        const {data: tokenDetails} = await axios.get(url);
        return {
            tokenData: tokenDetails.result
        }
    } catch (error) {
        console.error("Error in fetching token details: ", error.message);
    }
}

module.exports = {
    tokenInfo
}

