import { IAddressB } from '@interfaces/addresses/IAddressB.interface';
import { IAddressD } from '@interfaces/addresses/IAddressD.interface';
import { IAttachment } from '@interfaces/IAttachment.interface';

export interface ISparkpostBody {
  content: {
    attachments?: IAttachment[]
    headers?: {
      CC?: string[]
    },
    from: IAddressB;
    html?: string;
    reply_to: string;
    subject: string;
    template_id?: string;
    text?: string;
    use_draft_template?: boolean;
  },
  recipients: IAddressD[];
  substitution_data?: Record<string,unknown>;
}