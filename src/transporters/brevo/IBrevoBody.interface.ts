import type { IAddress } from '@interfaces/IAddress.interface';

export interface IBrevoBody {
  sender: IAddress;
  to: IAddress[];
  replyTo: IAddress;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, unknown>;
  cc?: IAddress[];
  bcc?: IAddress[];
  attachment?: Array<{ content: string; name: string }>;
  headers?: Record<string, string>;
}
