import { ISendingResponse } from '../types/interfaces/ISendingResponse.interface';
import { HTTP_METHOD } from './../types/enums/http-method.enum';

/**
 * Sending response wrapper
 */
export class SendingResponse implements ISendingResponse {

  /**
   * @description
   */
  accepted?: string|string[];

  /**
   * @description Request uri
   */
  uri: string;

  /**
   * @description HTTP protocol version
   */
  httpVersion: string;

  /**
   * @description
   */
  messageId?: string;

  /**
   * @description Request method
   */
  method: HTTP_METHOD;

  /**
   * @description Request headers
   */
  headers: object;

  /**
   * @description Response body
   */
  body: Record<string,unknown>;

  /**
   * @description HTTP status code
   */
  statusCode: number;

  /**
   * @description HTTP status message
   */
  statusMessage: string;

  constructor() {}

  /**
   * @description Property setter
   *
   * @param property
   * @param value
   */
  set(property: string, value: number|string|string[]|Record<string,unknown>|HTTP_METHOD): SendingResponse {
    this[property] = value;
    return this;
  }

  /**
   * @description Property getter
   *
   * @param property
   */
  get(property: string): number|string|string[]|Record<string,unknown>|HTTP_METHOD {
    return this[property];
  }

};