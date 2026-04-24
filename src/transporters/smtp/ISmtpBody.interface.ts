export interface ISmtpAttachment {
  filename: string;
  content: string;
  encoding: 'base64';
}

export interface ISmtpBody {
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: ISmtpAttachment[];
}
