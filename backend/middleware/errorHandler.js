const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error("Error caught by global handler:", {
    message: err.message,
    code: err.code,
    status: err.status,
    stack: err.stack,
  });

  let statusCode = err.status || 500;
  let message = "Internal server error";

  // 1. Handle database connection errors
  if (
    err.code === "ECONNREFUSED" ||
    err.code === "ENOTFOUND" ||
    err.code === "PROTOCOL_CONNECTION_LOST" ||
    err.code === "ER_ACCESS_DENIED_ERROR" ||
    err.code === "ER_BAD_DB_ERROR"
  ) {
    statusCode = 503;
    message = "Database connection failed";
  }
  // 2. Handle MySQL duplicate key errors (e.g. email duplicate)
  else if (err.code === "ER_DUP_ENTRY") {
    statusCode = 400;
    message = "Email already exists";
  }
  // 3. Handle custom thrown error messages
  else if (err.message === "Email already exists") {
    statusCode = 400;
    message = "Email already exists";
  } else if (err.message === "Invalid input data") {
    statusCode = 400;
    message = "Invalid input data";
  } else if (err.message === "Required field missing") {
    statusCode = 400;
    message = "Required field missing";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid input data";
  } else {
    // For other standard errors, return their message if set, otherwise the default 500 message
    message = err.message || "Internal server error";
  }

  res.status(statusCode).json({
    message: message,
  });
};

module.exports = errorHandler;
