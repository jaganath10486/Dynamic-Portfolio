import { AppError } from '@errors/app.error';
import { ErrorCode } from '@enums/error-code.enum';

export class CacheError extends AppError {
  constructor(message: string) {
    super(message, 503, ErrorCode.CacheUnavailable);
  }
}
