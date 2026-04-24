// SendGrid returns 202 with empty body; message ID is in the X-Message-Id response header
export interface ISendgridResponse {
  'x-message-id'?: string;
  server?: string;
}
