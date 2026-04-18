import type { IAttachment } from '@interfaces/IAttachment.interface';

export interface IResendBody {
  from: string;
  to: string | string[];
  subject: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  html: string;
  text?: string;
  headers?: Record<string, string>;
  attachments?: IAttachment[];
  tags?: Record<string, string>[];
  template?: {
    id: string;
    variables?: Record<string, string|number>;
  }
}
