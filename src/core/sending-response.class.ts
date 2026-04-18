import type { PROVIDER } from '@enums/provider.enum';
import type { ISendingResponse } from '@interfaces/ISendingResponse.interface';

/**
 * @summary Sending response wrapper
 */
export class SendingResponse implements ISendingResponse {
  provider?: PROVIDER;
  timestamp: number | null = null;
  server: string | null = null;
  uri: string | null = null;
  messageId?: string | null = null;
  headers: object | null = null;
  body: Record<string, unknown> | string | null = null;
  statusCode: number | null = null;
  statusMessage: string | null = null;

  set(property: string, value: unknown): SendingResponse {
    (this as Record<string, unknown>)[property] = value;
    return this;
  }

  get(property: string): unknown {
    return (this as Record<string, unknown>)[property];
  }
}
