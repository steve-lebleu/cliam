import type { IAddressable } from './IAddressable.interface';
import type { RenderEngine } from '@/types/types/render-engine.type';
import type { IPayload } from '../interfaces/IPayload.interface';

type ResolvedMeta = Omit<IPayload['meta'], 'from' | 'replyTo'> & {
  from: IAddressable;
  replyTo: IAddressable;
};

/**
 * @description
 */
export interface IMail {
  /**
   * @description On the fly email payload — from and replyTo guaranteed present after Mailer.setAddresses() already called
   */
  payload: Omit<IPayload, 'meta'> & { meta: ResolvedMeta };

  /**
   * @description Template id mapped on the current event request
   */
  templateId: string | null;

  /**
   * @description RenderEngine to use for the current request
   */
  renderEngine: RenderEngine;

  /**
   * @description Content of the email as HTML and plain text
   */
  body: { text: string, html: string } | null;
}
