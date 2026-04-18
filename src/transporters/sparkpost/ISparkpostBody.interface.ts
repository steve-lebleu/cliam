import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IAddress } from '@interfaces/IAddress.interface';

import type { ISparkpostAddress } from './ISparkpostAddress.interface';

export interface ISparkpostBody {
  content: {
    attachments?: IAttachment[]
    headers?: {
      CC?: string[]
    },
    from: IAddress;
    html?: string;
    reply_to: string;
    subject: string;
    template_id?: string;
    text?: string;
    use_draft_template?: boolean;
  },
  recipients: ISparkpostAddress[];
  substitution_data?: Record<string, unknown>;
}
