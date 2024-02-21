import { MODE } from 'types/enums/mode.enum';
import { PROVIDER } from 'types/enums/provider.enum';

/**
 * Define mail sending uniform response properties.
 */
export interface ISendingResponse {

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
}