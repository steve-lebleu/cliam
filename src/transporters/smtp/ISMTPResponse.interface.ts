/**
 * @description
 */
export interface ISMTPResponse {
  accepted?: string|string[];
  rejected?: string|string[];
  envelopeTime?: number;
  messageTime?: number;
  messageSize?: number;
  response?: string;
  envelope?: { from: string, to: string[] };
  messageId?: string;
}