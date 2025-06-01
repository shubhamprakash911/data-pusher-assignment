const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Account = require('./account');

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  httpMethod: {
    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
    allowNull: false
  },
  headers: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('headers');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('headers', JSON.stringify(value));
    }
  },
  accountId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Account,
      key: 'accountId'
    }
  }
}, {
  timestamps: true
});

// Define the relationship between Account and Destination
Account.hasMany(Destination, { foreignKey: 'accountId', onDelete: 'CASCADE' });
Destination.belongsTo(Account, { foreignKey: 'accountId' });

module.exports = Destination;
