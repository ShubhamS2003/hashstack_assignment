const tokenModel = require('../models/tokenModel');

// Send http request to fetch the token information with contract address as the request query

const tokenInfo = async(req, res) => {
    try {
        const { address } = req.query;
        const { tokenData } = await tokenModel.tokenInfo(address);
        res.status(201).json({tokenData});
    } catch (error) {
        console.error("Error in fetching token details controller: ", error.message);
    }
}

module.exports = {
    tokenInfo
}