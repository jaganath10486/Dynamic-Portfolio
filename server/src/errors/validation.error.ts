import { AppError } from '@errors/app.error';
import { ErrorCode } from '@enums/error-code.enum';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, ErrorCode.ValidationFailed);
  }
}
