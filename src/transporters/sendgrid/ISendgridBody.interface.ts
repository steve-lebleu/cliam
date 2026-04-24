import type { IAddress } from '@interfaces/IAddress.interface';
import type { IAttachment } from '@interfaces/IAttachment.interface';

export interface ISendgridPersonalization {
  to: IAddress[];
  cc?: IAddress[];
  bcc?: IAddress[];
}

export interface ISendgridBody {
  from: IAddress;
  personalizations: ISendgridPersonalization[];
  reply_to: IAddress;
  subject: string;
  content?: Array<{ type: string; value: string }>;
  template_id?: string;
  substitutions?: Record<string, unknown>;
  attachments?: IAttachment[];
  mail_settings?: { sandbox_mode: { enable: boolean } };
}
