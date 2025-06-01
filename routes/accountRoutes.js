const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Create a new account
router.post('/', accountController.createAccount);

// Get all accounts
router.get('/', accountController.getAllAccounts);

// Get account by ID
router.get('/:accountId', accountController.getAccountById);

// Update account
router.put('/:accountId', accountController.updateAccount);

// Delete account
router.delete('/:accountId', accountController.deleteAccount);

module.exports = router;
