import { MODE } from '../types/enums/mode.enum';
import { ISendingResponse } from '../types/interfaces/ISendingResponse.interface';
import { PROVIDER } from '../types/enums/provider.enum';

/**
 * Sending response wrapper
 */
export class SendingResponse implements ISendingResponse {

  /**
   * @description Request mode api|smtp
   */
  mode: MODE;

  /**
   * @description Request web API provider if mode is API
   */
  provider: PROVIDER;
  
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

  constructor() {}

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