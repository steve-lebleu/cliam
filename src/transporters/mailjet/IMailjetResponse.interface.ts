import type { IMailjetError } from './IMailjetError.interface';

export interface IMailjetMessageResult {
  Email: string;
  MessageUUID: string;
  MessageID: number;
  MessageHref: string;
}

export interface IMailjetResponse {
  Messages: Array<{
    Status: string;
    Errors?: IMailjetError[];
    To?: IMailjetMessageResult[];
    Cc?: IMailjetMessageResult[];
    Bcc?: IMailjetMessageResult[];
  }>;
}
