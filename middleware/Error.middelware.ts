import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utility';

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorDetails: string[] = [];

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        const fields = Object.keys(err.keyValue).join(', ');
        message = `Duplicate value entered for: ${fields}`;
        errorDetails = [`${fields} must be unique.`];
    }

    // Mongoose ValidationError
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errorDetails = Object.values(err.errors).map((el: any) => el.message);
    }

    // Mongoose CastError (e.g., invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid value for '${err.path}': ${err.value}`;
        errorDetails = [message];
    }

    // Handle custom ApiError (if not already covered)
    if (err instanceof ApiError && err.error.length > 0) {
        errorDetails = err.error;
    }

    // Dev logging
    if (process.env.NODE_ENV === 'development') {
        console.error('[ErrorMiddleware]', {
            name: err.name,
            message: err.message,
            stack: err.stack,
        });
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(errorDetails.length > 0 && { error: errorDetails }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
