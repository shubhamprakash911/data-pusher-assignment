const { Account } = require('../models');

// Create a new account
const createAccount = async (req, res) => {
  try {
    const { email, accountName, website } = req.body;

    // Validate required fields
    if (!email || !accountName) {
      return res.status(400).json({ message: 'Email and account name are required' });
    }

    // Check if account with email already exists
    const existingAccount = await Account.findOne({ where: { email } });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account with this email already exists' });
    }

    // Create new account
    const newAccount = await Account.create({
      email,
      accountName,
      website
    });

    return res.status(201).json({
      message: 'Account created successfully',
      account: {
        accountId: newAccount.accountId,
        email: newAccount.email,
        accountName: newAccount.accountName,
        appSecretToken: newAccount.appSecretToken,
        website: newAccount.website
      }
    });
  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all accounts
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      attributes: ['accountId', 'email', 'accountName', 'appSecretToken', 'website', 'createdAt', 'updatedAt']
    });
    return res.status(200).json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get account by ID
const getAccountById = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    return res.status(200).json({
      account: {
        accountId: account.accountId,
        email: account.email,
        accountName: account.accountName,
        appSecretToken: account.appSecretToken,
        website: account.website,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update account
const updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { email, accountName, website } = req.body;
    
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    // Check if email is being changed and already exists
    if (email && email !== account.email) {
      const existingAccount = await Account.findOne({ where: { email } });
      if (existingAccount) {
        return res.status(400).json({ message: 'Account with this email already exists' });
      }
    }
    
    // Update account fields
    if (email) account.email = email;
    if (accountName) account.accountName = accountName;
    if (website !== undefined) account.website = website;
    
    await account.save();
    
    return res.status(200).json({
      message: 'Account updated successfully',
      account: {
        accountId: account.accountId,
        email: account.email,
        accountName: account.accountName,
        appSecretToken: account.appSecretToken,
        website: account.website,
        updatedAt: account.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    await account.destroy();
    
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount
};
