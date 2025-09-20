/**
 * Standardized response utilities
 */

const sendSuccess = (res, data = null, message = null, statusCode = 200) => {
  const response = {};
  
  if (data !== null) {
    response.data = data;
  }
  
  if (message !== null) {
    response.message = message;
  }
  
  return res.status(statusCode).json(response);
};

const sendError = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    error: typeof error === 'string' ? error : error.message || 'Internal Server Error'
  });
};

module.exports = {
  sendSuccess,
  sendError
};