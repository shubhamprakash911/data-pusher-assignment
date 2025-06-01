const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');
const { initializeModels } = require('./models');
const routes = require('./routes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all routes
app.use('/', routes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Data Pusher API' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync models with database
    await initializeModels();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
