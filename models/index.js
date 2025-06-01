const Account = require('./account');
const Destination = require('./destination');

// Initialize models
const initializeModels = async () => {
  try {
    // Sync all models with the database
    await Account.sync();
    await Destination.sync();
    console.log('Models synchronized with the database successfully');
  } catch (error) {
    console.error('Error synchronizing models with the database:', error);
  }
};

module.exports = {
  Account,
  Destination,
  initializeModels
};
