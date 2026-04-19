import type { IResendAttachment } from './IResendAttachment.interface';

export interface IResendBody {
  from: string;
  to: string | string[];
  subject: string;
  reply_to?: string | string[];
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  headers?: Record<string, string>;
  scheduled_at?: string;
  topic_id?: string;
  attachments?: IResendAttachment[];
  tags?: Array<{ name: string; value: string }>;
  template?: {
    id: string;
    variables?: Record<string, string | number>;
  };
}
