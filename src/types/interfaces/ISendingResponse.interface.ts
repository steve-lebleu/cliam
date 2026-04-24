import type { Provider } from '@typings/provider.type';

/**
 * Define mail sending uniform response properties.
 */
export interface ISendingResponse {
  provider?: Provider;
  timestamp: number | null;
  server: string | null;
  uri: string | null;
  messageId?: string | null;
  headers: object | null;
  body: Record<string, unknown> | string | null;
  statusCode: number | null;
  statusMessage: string | null;
}
