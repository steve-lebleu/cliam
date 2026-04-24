export interface IMandrillAttachment {
  type?: string;
  name: string;
  content: string;
}

export interface IMandrillMessage {
  subject: string;
  from_email: string;
  from_name?: string;
  to: string[];
  headers: { 'Reply-To': string };
  track_opens: boolean;
  track_click: boolean;
  preserve_recipients: boolean;
  text?: string;
  html?: string;
  attachments?: IMandrillAttachment[];
}

export interface IMandrillBody {
  message: IMandrillMessage;
  template_name?: string;
  template_content?: Record<string, unknown>[];
}
