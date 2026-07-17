import { Request, NextFunction } from 'express';
import { AppError } from '@errors/app.error';
import { ErrorCode } from '@enums/error-code.enum';
import { NODE_ENV } from '@config/app.config';

export const ErrorMiddleware = (
  error: AppError | Error,
  req: Request,
  res: any,
): void => {
  const isAppError = error instanceof AppError;
  const message = error?.message || 'Unexpected error occurred.';
  const statusCode = isAppError ? (error as AppError).statusCode : 500;
  const errorType = isAppError ? (error as AppError).code : ErrorCode.InternalServerError;

  if (!isAppError && NODE_ENV === 'development') {
    console.error('Error', error);
  }

  res.isError = true;
  res.errorData = { message, statusCode, errorType };

  res.status(statusCode).json({
    data: null,
    error: {
      message,
      statusCode,
      errorType,
    },
  });
};
