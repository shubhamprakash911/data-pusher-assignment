const { Account, Destination } = require('../models');
const axios = require('axios');
const querystring = require('querystring');

// Handle incoming data
const handleIncomingData = async (req, res) => {
  try {
    // Get app secret token from header
    const appSecretToken = req.headers['cl-x-token'];
    
    // Check if token is provided
    if (!appSecretToken) {
      return res.status(401).json({ message: 'Un Authenticate' });
    }
    
    // Check if data is JSON
    if (req.method !== 'POST' || !req.is('application/json')) {
      return res.status(400).json({ message: 'Invalid Data' });
    }
    
    // Find account by app secret token
    const account = await Account.findOne({ where: { appSecretToken } });
    if (!account) {
      return res.status(401).json({ message: 'Un Authenticate' });
    }
    
    // Get all destinations for this account
    const destinations = await Destination.findAll({
      where: { accountId: account.accountId }
    });
    
    if (destinations.length === 0) {
      return res.status(200).json({ 
        message: 'Data received successfully, but no destinations found for this account',
        accountId: account.accountId
      });
    }
    
    // Forward data to all destinations
    const forwardPromises = destinations.map(destination => 
      forwardDataToDestination(destination, req.body)
    );
    
    // Wait for all forwarding to complete
    const results = await Promise.allSettled(forwardPromises);
    
    // Count successful and failed forwards
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return res.status(200).json({
      message: 'Data processed successfully',
      accountId: account.accountId,
      stats: {
        totalDestinations: destinations.length,
        successful,
        failed
      }
    });
  } catch (error) {
    console.error('Error handling incoming data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Forward data to a destination
const forwardDataToDestination = async (destination, data) => {
  try {
    const { url, httpMethod, headers } = destination;
    
    // Parse headers from JSON string if needed
    const parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
    
    let response;
    
    // Handle different HTTP methods
    switch (httpMethod.toUpperCase()) {
      case 'GET':
        // For GET requests, convert data to query parameters
        const queryParams = querystring.stringify(data);
        const urlWithParams = `${url}${url.includes('?') ? '&' : '?'}${queryParams}`;
        response = await axios.get(urlWithParams, { headers: parsedHeaders });
        break;
        
      case 'POST':
        // For POST requests, send data as JSON body
        response = await axios.post(url, data, { headers: parsedHeaders });
        break;
        
      case 'PUT':
        // For PUT requests, send data as JSON body
        response = await axios.put(url, data, { headers: parsedHeaders });
        break;
        
      case 'PATCH':
        // For PATCH requests, send data as JSON body
        response = await axios.patch(url, data, { headers: parsedHeaders });
        break;
        
      case 'DELETE':
        // For DELETE requests, send data as query parameters
        const deleteQueryParams = querystring.stringify(data);
        const deleteUrlWithParams = `${url}${url.includes('?') ? '&' : '?'}${deleteQueryParams}`;
        response = await axios.delete(deleteUrlWithParams, { headers: parsedHeaders });
        break;
        
      default:
        throw new Error(`Unsupported HTTP method: ${httpMethod}`);
    }
    
    return {
      destinationId: destination.id,
      status: response.status,
      success: true
    };
  } catch (error) {
    console.error(`Error forwarding data to destination ${destination.id}:`, error);
    throw error;
  }
};

module.exports = {
  handleIncomingData
};
