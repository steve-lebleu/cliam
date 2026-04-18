import type { ISendingError } from '@interfaces/ISendingError.interface';

/**
 * @summary Sending error wrapper as the only one error type delivered by Cliam.
 */
export class SendingError implements ISendingError {
  /**
   * @description HTTP response status code
   */
  statusCode: number;

  /**
   * @description HTTP response status message
   */
  statusText: string;

  /**
   * @description HTTP response errors
   */
  errors: string[];

  constructor(status: number, message: string, errors: string[]) {
    this.statusCode = status;
    this.statusText = message;
    this.errors = errors;
  }
}
