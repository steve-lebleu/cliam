import type { IAddress } from '@interfaces/IAddress.interface';

export interface IMailersendBody {
  from: IAddress;
  to: IAddress[];
  subject: string;
  reply_to: IAddress;
  html?: string;
  text?: string;
  template_id?: string;
  personalization?: Array<{ email: string; data: Record<string, unknown> }>;
  cc?: IAddress[];
  bcc?: IAddress[];
  attachments?: Array<{ content: string; filename: string }>;
}
