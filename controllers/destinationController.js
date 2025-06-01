const { Destination, Account } = require('../models');

// Create a new destination
const createDestination = async (req, res) => {
  try {
    const { url, httpMethod, headers, accountId } = req.body;

    // Validate required fields
    if (!url || !httpMethod || !headers || !accountId) {
      return res.status(400).json({ message: 'URL, HTTP method, headers, and account ID are required' });
    }

    // Check if account exists
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Validate HTTP method
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!validMethods.includes(httpMethod.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid HTTP method' });
    }

    // Create new destination
    const newDestination = await Destination.create({
      url,
      httpMethod: httpMethod.toUpperCase(),
      headers,
      accountId
    });

    return res.status(201).json({
      message: 'Destination created successfully',
      destination: {
        id: newDestination.id,
        url: newDestination.url,
        httpMethod: newDestination.httpMethod,
        headers: newDestination.headers,
        accountId: newDestination.accountId
      }
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all destinations
const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    return res.status(200).json({ destinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get destination by ID
const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    return res.status(200).json({ destination });
  } catch (error) {
    console.error('Error fetching destination:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get destinations by account ID
const getDestinationsByAccountId = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Check if account exists
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    const destinations = await Destination.findAll({
      where: { accountId }
    });
    
    return res.status(200).json({ destinations });
  } catch (error) {
    console.error('Error fetching destinations by account ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update destination
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, httpMethod, headers } = req.body;
    
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Validate HTTP method if provided
    if (httpMethod) {
      const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      if (!validMethods.includes(httpMethod.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid HTTP method' });
      }
    }
    
    // Update destination fields
    if (url) destination.url = url;
    if (httpMethod) destination.httpMethod = httpMethod.toUpperCase();
    if (headers) destination.headers = headers;
    
    await destination.save();
    
    return res.status(200).json({
      message: 'Destination updated successfully',
      destination: {
        id: destination.id,
        url: destination.url,
        httpMethod: destination.httpMethod,
        headers: destination.headers,
        accountId: destination.accountId
      }
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete destination
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    await destination.destroy();
    
    return res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
  getDestinationsByAccountId,
  updateDestination,
  deleteDestination
};
