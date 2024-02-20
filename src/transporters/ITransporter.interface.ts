import { SendingResponse } from '../classes/sending-response.class';
import { SendingError } from '../classes/sending-error.class';
import { ITransporterMailer } from './ITransporterMailer.interface';
import { IBuildable } from '../types/interfaces/IBuildable.interface';
import { ITransporterConfiguration } from './ITransporterConfiguration.interface';

/**
 * Define and grant (mandatory) members of a Transporter instance.
 */
export interface ITransporter {
  configuration: ITransporterConfiguration;
  transporter: ITransporterMailer;
  address: (recipient: any, type?: string) => any;
  addresses: (recipients: any, type?: string) => any;
  build: ({ ...args }: IBuildable) => any;
  error: (error: any) => SendingError;
  response: (payload: any) => SendingResponse;
  sendMail?: (body: any, callback: (err, result) => void ) => void;
}