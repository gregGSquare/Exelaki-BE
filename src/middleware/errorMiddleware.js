/**
 * Global error handling middleware
 */
const { ApiError, sendErrorResponse, ErrorTypes } = require('../utils/errorUtils');
const mongoose = require('mongoose');

// Not found middleware - for routes that don't exist
const notFound = (req, res, next) => {
  const error = new ApiError(
    404,
    `Not Found - ${req.originalUrl}`
  );
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Log detailed error information for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  // Handle specific error types
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    return sendErrorResponse(
      res,
      ErrorTypes.VALIDATION_ERROR.code,
      'Validation failed',
      details
    );
  }

  // Mongoose cast errors (invalid ID)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendErrorResponse(
      res,
      ErrorTypes.BAD_REQUEST.code,
      `Invalid ${err.path}: ${err.value}`
    );
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendErrorResponse(
      res,
      ErrorTypes.BAD_REQUEST.code,
      `Duplicate value for ${field}: ${err.keyValue[field]}`
    );
  }

  // Express-validator errors
  if (err.array && typeof err.array === 'function') {
    const details = err.array().map(error => ({
      field: error.param,
      message: error.msg
    }));
    return sendErrorResponse(
      res,
      ErrorTypes.VALIDATION_ERROR.code,
      'Validation failed',
      details
    );
  }

  // Handle our custom API errors
  if (err instanceof ApiError) {
    return sendErrorResponse(
      res,
      err.statusCode,
      err.message,
      err.details
    );
  }

  // Auth0 errors
  if (err.name === 'UnauthorizedError') {
    return sendErrorResponse(
      res,
      ErrorTypes.UNAUTHORIZED.code,
      'Invalid or expired token'
    );
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  
  return sendErrorResponse(
    res,
    statusCode,
    process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : message
  );
};

module.exports = { notFound, errorHandler }; 