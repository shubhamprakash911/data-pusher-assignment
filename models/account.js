const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Account = sequelize.define('Account', {
  accountId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4(),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appSecretToken: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => uuidv4()
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Account;
