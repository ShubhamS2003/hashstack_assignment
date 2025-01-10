const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Route to fetch the account information

router.get('/account_info', accountController.accountInfo);

module.exports = router;