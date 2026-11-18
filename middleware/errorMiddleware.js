
const errorMiddleware = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    let message = err.message || 'Internal Server Error';

    // Invalid MongoDB ID
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid Product ID';
    }

    // Duplicate value
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value';
    }

    // Validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;
