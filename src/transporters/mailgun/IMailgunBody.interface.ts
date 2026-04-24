export interface IMailgunBody {
  from: string;
  to: string[];
  'h:Reply-To': string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  'h:X-Mailgun-Variables'?: string;
  cc?: string[];
  bcc?: string[];
  'o:testmode'?: string;
  attachments?: Array<{ content: string; filename: string; type?: string }>;
}
