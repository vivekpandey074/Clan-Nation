class ApiError extends Error {
  constructor(statusCode, message = "Something went error", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
  }
}

module.exports = ApiError;
