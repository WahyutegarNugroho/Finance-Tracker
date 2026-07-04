/**
 * Standardized API response helpers
 */

// ponytail: always-sent message field → omit when default when bandwidth optimization matters
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const created = (res, data = null, message = 'Created successfully') => {
  return success(res, data, message, 201);
};

const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

const error = (res, message = 'An error occurred', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: statusCode >= 500 ? 'Server Error' : 'Client Error',
    message,
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

const notFound = (res, resource = 'Resource') => {
  return error(res, `${resource} not found.`, 404);
};

module.exports = { success, created, paginated, error, notFound };
