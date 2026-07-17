import { AppError } from '@errors/app.error';
import { ErrorCode } from '@enums/error-code.enum';

export class ExternalApiError extends AppError {
  constructor(message: string) {
    super(message, 502, ErrorCode.ExternalApiFailed);
  }
}
