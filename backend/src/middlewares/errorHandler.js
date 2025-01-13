import CustomError from '../errors/custom-error.js';

function errorHandler(err, req, res, next) {
    if (err instanceof CustomError) {
        // Manejo de errores personalizados
        res.status(400).json({
            status: 'error',
            name: err.name,
            code: err.code,
            message: err.message,
            cause: err.cause,
        });
    } else {
        // Manejo de errores no esperados
        console.error('Unexpected error:', err);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
}

export default errorHandler;