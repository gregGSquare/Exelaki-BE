const helmet = require('helmet');
const cors = require('cors');
const express = require('express');

module.exports = function(app) {
  // Use Helmet to secure HTTP headers
  app.use(helmet());

  // Enable CORS with credentials
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow frontend URL from environment variables
    credentials: true, // Allow credentials (cookies) to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Middleware to parse JSON
  app.use(express.json());
};