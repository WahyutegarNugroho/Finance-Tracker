const { validationResult } = require('express-validator');

/**
 * Validation middleware
 * Runs after express-validator checks and returns errors if any
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel — express-validator.run is async-safe
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Request validation failed.',
      details: extractedErrors,
    });
  };
};

module.exports = { validate };
