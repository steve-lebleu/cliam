export interface IPostmarkAttachment {
  ContentTransferEncoding: string;
  Content: string;
  Name: string;
  ContentID: string;
}

export interface IPostmarkBody {
  From: string;
  To: string;
  ReplyTo: string;
  Subject: string;
  TextBody?: string;
  HtmlBody?: string;
  TemplateId?: number;
  TemplateModel?: Record<string, unknown>;
  Cc?: string;
  Bcc?: string;
  Attachments?: IPostmarkAttachment[];
}
