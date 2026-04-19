import type { Options } from 'nodemailer/lib/smtp-transport';
import type { ISmtpResponse } from './ISmtpResponse.interface';

export interface ISmtpTransport {
  options?: Options;
  //sendMail(body: unknown, callback: (err: Error | null, info: ISMTPResponse) => void): void;
  sendMail(body: unknown): Promise<ISmtpResponse>;
}
