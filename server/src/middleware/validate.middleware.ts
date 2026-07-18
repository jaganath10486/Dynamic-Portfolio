import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { ValidationError } from '@errors/validation.error';

type RequestTarget = 'query' | 'body' | 'params';

export const validate =
  (schema: ZodType, target: RequestTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const message = result.error.errors
        .map((e) => (e.path.length ? `${e.path.join('.')}: ${e.message}` : e.message))
        .join('; ');
      next(new ValidationError(message));
      return;
    }
    res.locals[target] = result.data;
    next();
  };
