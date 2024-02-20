import { RenderEngine } from 'types/types/render-engine.type';
import { IPayload } from '../interfaces/IPayload.interface';

/**
 * @description
 */
export interface IMail {
  /**
   * @description On the fly email payload
   */
  payload: IPayload;

  /**
   * @description Template id mapped on the current event request
   */
  templateId: string;

  /**
   * @description RenderEngine to use for the current request
   */
  renderEngine: RenderEngine;

  /**
   * @description Content of the email as HTML and plain text
   */
  body: { text: string, html: string };

  /**
   * @description Origin domain to use for the current sending
   */
  origin: string;
}