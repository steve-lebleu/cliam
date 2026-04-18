import type { IAttachment } from '../../types/interfaces/IAttachment.interface';
import type { IAddressB } from '../../types/interfaces/addresses/IAddressB.interface';
import type { IAddressD } from '../../types/interfaces/addresses/IAddressD.interface';

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