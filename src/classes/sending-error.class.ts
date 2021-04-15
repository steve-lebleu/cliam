import { IError } from './../types/interfaces/IError.interface';

/**
 * Type sending error
 */
export class SendingError implements IError {

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