import { IAttachment } from './IAttachment.interface';
import { IAddressable } from './addresses/IAddressable.interface';
import { IBuffer } from './IBuffer.interface';
import { RENDER_ENGINE } from '../enums/render-engine.enum';

/**
 * Define a payload schema type
 */
export interface IPayload {

  /**
   * @description Unique transporter id reference
   */
  transporterId?: string;

  /**
   * @description Render engine to use for the current mail request
   */
  renderEngine: RENDER_ENGINE;

  /**
   * @description Meta data for email sending
   */
  meta: {

    /**
     * @description Template id to use
     * @deprecated The template is retrieved regarding the action and the compilation type
     */
    templateId?: string;

    /**
     * @description From address object
     */
    from?: IAddressable;

    /**
     * @description Recipients addresses objects
     */
    to: Array<string> | Array<IAddressable>;

    /**
     * @description Reply-to address object
     */
    replyTo?: IAddressable;

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