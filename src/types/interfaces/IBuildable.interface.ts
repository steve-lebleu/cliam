import { IPayload } from '@interfaces/IPayload.interface';

/**
 * @description
 */
export interface IBuildable {
  payload: IPayload;
  templateId: string;
  body: { text: string, html: string };
  origin: string;
}