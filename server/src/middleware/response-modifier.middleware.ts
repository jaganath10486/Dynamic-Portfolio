import { IResult } from '@interfaces/request.interface';
import { Request, NextFunction } from 'express';

const isEmpty = (obj: unknown): boolean => {
  if (!obj || typeof obj !== 'object') return true;
  return Object.keys(obj).length === 0;
};

export const ResponseModifier = (req: Request, res: any, next: NextFunction): void => {
  try {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      if (body?.skipResponseModifier) {
        return originalJson(body);
      }
      const response: Partial<IResult> = {};
      if (res.isError) {
        response.data = body.data || null;
        if (!isEmpty(body.additionalData)) {
          response.additionalData = body.additionalData;
        }
        response.success = false;
        response.message = body.error.message;
        response.error = {
          description: body.error.message,
          statusCode: body.error.statusCode,
          errorType: body.error.errorType,
        };
      } else {
        response.data = body.data;
        response.success = true;
        if (body.pagination) {
          response.pagination = body.pagination;
        }
        if (body.additionalData) {
          response.additionalData = body.additionalData;
        }
        response.message = body.message || 'Successfully executed';
      }
      return originalJson(response);
    };
    next();
  } catch (_err) {
    next();
  }
};
