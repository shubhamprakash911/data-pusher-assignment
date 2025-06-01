# Data Pusher Application

A Node.js Express web application that receives data for an account and forwards it to multiple destinations using webhook URLs.

## Overview

This application allows you to:
- Create and manage accounts
- Configure multiple destinations for each account
- Receive data through a webhook endpoint
- Forward received data to all destinations configured for an account

## Modules

### 1. Account Module
- Manages accounts with email, name, and auto-generated secret token
- Each account has a unique ID and secret token
- Provides CRUD operations for accounts

### 2. Destination Module
- Configures webhook destinations for accounts
- Each destination has a URL, HTTP method, and headers
- An account can have multiple destinations
- Provides CRUD operations for destinations

### 3. Data Handler Module
- Receives JSON data via POST requests
- Authenticates requests using the app secret token
- Identifies the account based on the secret token
- Forwards data to all destinations for that account

## API Endpoints

### Account APIs
- `POST /api/accounts` - Create a new account
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:accountId` - Get account by ID
- `PUT /api/accounts/:accountId` - Update account
- `DELETE /api/accounts/:accountId` - Delete account

### Destination APIs
- `POST /api/destinations` - Create a new destination
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `GET /api/destinations/account/:accountId` - Get destinations by account ID
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination

### Data Handler API
- `POST /server/incoming_data` - Endpoint to receive incoming data

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/shubhamprakash911/data-pusher-assignment.git
   cd data-pusher-assignment
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the server
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

## Usage Examples

### Create an Account
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","accountName":"Test Account","website":"https://example.com"}'
```

### Create a Destination
```bash
curl -X POST http://localhost:3000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{"url":"https://webhook.site/your-id","httpMethod":"POST","headers":{"Content-Type":"application/json","Authorization":"Bearer token"},"accountId":"your-account-id"}'
```

### Send Data to the Handler
```bash
curl -X POST http://localhost:3000/server/incoming_data \
  -H "Content-Type: application/json" \
  -H "CL-X-TOKEN: your-app-secret-token" \
  -d '{"key":"value","user":{"name":"John","email":"john@example.com"}}'
```

## Technologies Used

- Node.js
- Express.js
- SQLite (with Sequelize ORM)
- Axios for HTTP requests