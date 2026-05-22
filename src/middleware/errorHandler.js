import { HttpError } from 'http-errors';
import { isCelebrateError } from 'celebrate';

export function errorHandler(err, req, res, next) {
  // Обробка помилок валідації від celebrate
  if (isCelebrateError(err)) {
    const errorMessages = [];
    for (const [segment, joiError] of err.details.entries()) {
      errorMessages.push(...joiError.details.map(detail => detail.message));
    }
    return res.status(400).json({
      message: errorMessages.join(', '),
    });
  }

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
