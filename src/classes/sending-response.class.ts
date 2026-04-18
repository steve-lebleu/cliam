import type { PROVIDER } from '@enums/provider.enum';
import type { ISendingResponse } from '@interfaces/ISendingResponse.interface';

/**
 * Sending response wrapper
 */
export class SendingResponse implements ISendingResponse {

  /**
   * @description Request web API provider if mode is API
   */
  provider?: PROVIDER;

  /**
   * @description Timestamp returned by Cliam wrapper
   */
  timestamp: string;

  /**
   * @description Request server
   */
  server: string;

  /**
   * @description Request uri
   */
  uri: string;

  /**
   * @description
   */
  messageId?: string;

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

  /**
   * @description Property setter
   *
   * @param property
   * @param value
   */
  set(property: string, value: number|string|string[]|Record<string,unknown>): SendingResponse {
    this[property] = value;
    return this;
  }

  /**
   * @description Property getter
   *
   * @param property
   */
  get(property: string): number|string|string[]|Record<string,unknown> {
    return this[property];
  }

};
