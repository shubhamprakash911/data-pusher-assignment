const express = require('express');
const router = express.Router();
const dataHandlerController = require('../controllers/dataHandlerController');

// Handle incoming data
router.post('/incoming_data', dataHandlerController.handleIncomingData);

module.exports = router;
