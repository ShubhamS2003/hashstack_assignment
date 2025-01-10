const axios  = require ('axios');
const prismaClient = require('../../lib/db')

require('dotenv').config();

const BLOCKCYPHER_BASE_URL = process.env.BLOCKCYPHER_BASE_URL

// Fetch the account information from BlockCypher api

const accountInfo = async (address) => {
    try {
        const url = `${BLOCKCYPHER_BASE_URL}/addrs/${address}`
        const {data: accountData} = await axios.get(url);
        // console.log(accountData);
        const accountInformation = {
            address: accountData.address,
            wei_received: accountData.total_received,
            wei_sent: accountData.total_sent,
            balance: accountData.final_balance,
            transactions: accountData.final_n_tx
        }
        console.log(accountInformation);
        return {
            accountInformation
        }
    } catch (error) {
        console.error("Error fetching account details", error.message);
    }
}

module.exports = {
    accountInfo
}


