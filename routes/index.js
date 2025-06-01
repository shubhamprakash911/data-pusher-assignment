const express = require('express');
const router = express.Router();
const accountRoutes = require('./accountRoutes');
const destinationRoutes = require('./destinationRoutes');
const dataHandlerRoutes = require('./dataHandlerRoutes');

// Mount routes
router.use('/api/accounts', accountRoutes);
router.use('/api/destinations', destinationRoutes);
router.use('/server', dataHandlerRoutes);

module.exports = router;
