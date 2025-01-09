const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

router.get('/latest_block', blockController.latestBlock);
router.get('/n_latest_block', blockController.nLatestBlocks);


module.exports = router;