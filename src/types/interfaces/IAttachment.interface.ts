import { ATTACHMENT_DISPOSITION } from '../enums/attachment-disposition.enum';
import { ATTACHMENT_MIME_TYPE } from '../enums/attachment-mime-type.enum';

/**
 * Describe fields of an email attachment
 */
export interface IAttachment {

  /**
   * @description Base64 encoded content
   */
  content: string;

  /**
   * @description Mime-Type of the attachment
   */
  type?: ATTACHMENT_MIME_TYPE;

  /**
   * @description File name of the attachment
   */
  filename: string;

  /**
   * @description Attachment disposition
   */
  disposition?: ATTACHMENT_DISPOSITION;
}