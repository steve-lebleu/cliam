import { IAttachment } from '../../types/interfaces/IAttachment.interface';
export interface IPostmarkBody {
    from: string;
    to: Array<string>;
    replyTo: string;
    subject: string;
    templateModel?: Record<string, unknown>;
    templateId?: string;
    text?: string;
    html?: string;
    cc?: Array<string>;
    bcc?: Array<string>;
    attachments?: Array<IAttachment>;
}
