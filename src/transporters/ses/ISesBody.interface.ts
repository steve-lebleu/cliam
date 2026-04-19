export interface ISesBody {
  FromEmailAddress: string;
  ReplyToAddresses: string[];
  Destination: {
    ToAddresses: string[];
    CcAddresses?: string[];
    BccAddresses?: string[];
  };
  Content: {
    Simple?: {
      Subject: { Data: string; Charset: 'UTF-8' };
      Body: {
        Text?: { Data: string; Charset: 'UTF-8' };
        Html?: { Data: string; Charset: 'UTF-8' };
      };
      Attachments?: Array<{
        FileName: string;
        RawContent: string;
        ContentType?: string;
        ContentDisposition?: string;
        ContentTransferEncoding?: 'BASE64';
      }>;
    };
    Template?: {
      TemplateName: string;
      TemplateData?: string;
    };
  };
}
