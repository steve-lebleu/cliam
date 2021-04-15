import { IAttachment } from '@interfaces/IAttachment.interface';
import { IAddressable } from '@interfaces/addresses/IAddressable.interface';
import { IBuffer } from '@interfaces/IBuffer.interface';
import { Compiler } from '@ctypes/compiler.type';

/**
 * Define a payload schema type
 */
export interface IPayload {

  /**
   * @description
   */
  compiler?: Compiler;

  /**
   * @description Meta data for email sending
   */
  meta: {

    /**
     * @description Template id to use
     * @deprecated le template est récupéré en fonction de l'action, et du type d'email (compilé en external)
     */
    templateId?: string;

    /**
     * @description From address object
     */
    from: IAddressable;

    /**
     * @description Recipients addresses objects
     */
    to: Array<string> | Array<IAddressable>;

    /**
     * @description Reply-to address object
     */
    replyTo: IAddressable;

    /**
     * @description Subject of email
     */
    subject: string;

    /**
     * @description CC recipients addresses objects
     */
    cc?: Array<string|IAddressable>;

    /**
     * @description BCC recipients addresses objects
     */
    bcc?: Array<string|IAddressable>;

    /**
     * @description Attachments objects to join to email
     */
    attachments?: Array<IAttachment>;

    /**
     * @description Images objects to include to email
     */
    inlineImages?: Array<IAttachment>
  };

  /**
   * @description Variables to use when template is compilated
   */
  data?: Record<string,unknown>;

  /**
   * @description Email stream contents to send
   */
  content?: IBuffer[];
}