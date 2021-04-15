import { IPayload } from '@interfaces/IPayload.interface';
import { SendingResponse } from '@classes/sending-response.class';
import { SendingError } from '@classes/sending-error.class';
import { ISendMail } from '../types/interfaces/ISendMail.interface';
import { IBuildable } from '@interfaces/IBuildable.interface';

/**
 * Define and grant (mandatory) members of a Transporter instance.
 */
export interface ITransporter {
  transporter: ISendMail;
  address: (recipient: any, type?: string) => any;
  addresses: (recipients: any, type?: string) => any;
  build: ({ ...args }: IBuildable) => any;
  error: (error: any) => SendingError;
  response: (payload: any) => SendingResponse;
  sendMail?: (body: any, callback: (err, result) => void ) => void;
}