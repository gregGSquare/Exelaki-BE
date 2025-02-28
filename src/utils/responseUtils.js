/**
 * Response utilities for consistent response formatting across the application
 */

// Standard success response function
const sendSuccessResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Common success responses
const successResponses = {
  // 200 - OK
  OK: (res, message = 'Request successful', data = null) => 
    sendSuccessResponse(res, 200, message, data),
  
  // 201 - Created
  CREATED: (res, message = 'Resource created successfully', data = null) => 
    sendSuccessResponse(res, 201, message, data),
  
  // 204 - No Content
  NO_CONTENT: (res, message = 'Request successful, no content to return') => 
    res.status(204).end(),
  
  // Custom paginated response
  PAGINATED: (res, data, page, limit, total, message = 'Data retrieved successfully') => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return sendSuccessResponse(res, 200, message, {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    });
  }
};

module.exports = {
  sendSuccessResponse,
  successResponses
}; 