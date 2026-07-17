import { Request, Response } from 'express';

export const NotFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    data: null,
    error: {
      message: 'The requested does not exist.',
      statusCode: 404,
      errorType: 'NOT_FOUND',
    },
  });
};
