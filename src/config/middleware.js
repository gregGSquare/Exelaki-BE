const helmet = require('helmet');
const cors = require('cors');
const express = require('express');

module.exports = function(app) {
  // Use Helmet to secure HTTP headers
  app.use(helmet());

  // Enable CORS with credentials
  app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.PRODUCTION_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Middleware to parse JSON
  app.use(express.json());
};