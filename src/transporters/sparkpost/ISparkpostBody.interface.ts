import type { IAddressable } from '@interfaces/IAddressable.interface';
import type { ISparkpostAddress } from './ISparkpostAddress.interface';

export interface ISparkpostAttachment {
  name: string;
  type?: string;
  data: string;
}

export interface ISparkpostBody {
  recipients: ISparkpostAddress[];
  content: {
    from: string | IAddressable;
    subject: string;
    reply_to: string;
    html?: string;
    text?: string;
    template_id?: string;
    use_draft_template?: boolean;
    headers?: { CC?: string[] };
    attachments?: ISparkpostAttachment[];
  };
  substitution_data?: Record<string, unknown>;
  options?: { sandbox: boolean };
}
