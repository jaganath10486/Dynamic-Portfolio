import { Request } from "express";

export interface IRequest extends Request {
  user: null;
}

export interface IResult {
  data: unknown;
  pagination?: unknown;
  error?: {
    description?: string;
    statusCode?: unknown;
    errorType?: unknown;
  };
  message: string;
  success: boolean;
  additionalData?: unknown;
}
