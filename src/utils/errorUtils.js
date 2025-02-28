/**
 * Error utilities for consistent error handling across the application
 */

// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Standard error response function
const sendErrorResponse = (res, statusCode, message, details = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

// Error types with standard messages
const ErrorTypes = {
  BAD_REQUEST: { code: 400, message: 'Bad request' },
  UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
  FORBIDDEN: { code: 403, message: 'Forbidden' },
  NOT_FOUND: { code: 404, message: 'Resource not found' },
  VALIDATION_ERROR: { code: 422, message: 'Validation error' },
  INTERNAL_ERROR: { code: 500, message: 'Internal server error' },
  SERVICE_UNAVAILABLE: { code: 503, message: 'Service unavailable' }
};

// Async handler to eliminate try/catch blocks in controllers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  ApiError,
  sendErrorResponse,
  ErrorTypes,
  asyncHandler
}; 