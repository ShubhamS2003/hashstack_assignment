const express = require('express');
const router = express.Router();

const tokenController = require('../controllers/tokenController');

// Route to fetch the token information

router.get('/token_info', tokenController.tokenInfo);

module.exports = router;