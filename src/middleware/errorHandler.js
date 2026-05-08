import { HttpError } from 'http-errors';

export function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof HttpError) {
    statusCode = err.status;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
  });
}
