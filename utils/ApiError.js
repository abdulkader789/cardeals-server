class ApiError extends Error {
    constructor(statusCode, message, errors = [], data = null) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
