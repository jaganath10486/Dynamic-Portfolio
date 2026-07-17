import { ErrorCode } from "@enums/error-code.enum";

export class AppError extends Error {
  public statusCode: number;
  public code: ErrorCode;

  constructor(message: string, statusCode: number, code: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
