const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

// Routes to fetch the latest blocks

router.get('/latest_block', blockController.latestBlock);
router.get('/n_latest_block', blockController.nLatestBlocks);


module.exports = router;