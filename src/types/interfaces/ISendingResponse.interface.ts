import { HTTP_METHOD } from '../enums/http-method.enum';

/**
 * Define mail sending uniform response properties.
 */
export interface ISendingResponse {

  /**
   * @description URI of the request
   */
  uri: string;

  /**
   * @description HTTP protocol version used by the requested server
   */
  httpVersion: string;

  /**
   * @description HTTP method of the request
   */
  method: HTTP_METHOD;

  /**
   * @description HTTP headers of the response
   */
  headers: Object;

  /**
   * @description Content returned by the requested API
   */
  body: Object;

  /**
   * @description HTTP status code
   */
  statusCode: number;

  /**
   * @description HTTP status message
   */
  statusMessage: string;
}