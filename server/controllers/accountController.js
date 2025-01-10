const accountModel = require('../models/accountModel');

// Send http request to fetch the account information with account address as the request query

const accountInfo = async(req, res) => {
    try {
        const { address } = req.query;
        const { accountInformation } = await accountModel.accountInfo(address);
        console.log(address);
        console.log(accountInformation);
        res.status(201).json({ accountInformation });
    } catch (error){
        console.error("Error fetching account details ", error.message);
    }
}

module.exports = {
    accountInfo
}


