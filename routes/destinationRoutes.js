const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Create a new destination
router.post('/', destinationController.createDestination);

// Get all destinations
router.get('/', destinationController.getAllDestinations);

// Get destination by ID
router.get('/:id', destinationController.getDestinationById);

// Get destinations by account ID
router.get('/account/:accountId', destinationController.getDestinationsByAccountId);

// Update destination
router.put('/:id', destinationController.updateDestination);

// Delete destination
router.delete('/:id', destinationController.deleteDestination);

module.exports = router;
