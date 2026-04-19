import type { IMailjetAddress } from './IMailjetAddress.interface';
import type { IMailjetAttachment } from './IMailjetAttachment.interface';

export interface IMailjetMessage {
  From: IMailjetAddress;
  To: IMailjetAddress[];
  ReplyTo: IMailjetAddress;
  Subject: string;
  HTMLPart?: string;
  TextPart?: string;
  TemplateID?: number;
  TemplateLanguage?: boolean;
  Variables?: Record<string, unknown>;
  Cc?: IMailjetAddress[];
  Bcc?: IMailjetAddress[];
  Attachments?: IMailjetAttachment[];
  SandboxMode?: boolean;
}

export interface IMailjetBody {
  Messages: IMailjetMessage[];
}
