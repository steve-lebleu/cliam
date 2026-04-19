import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { Transporter } from '@transporters/transporter.class';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';
import type { ISendingError } from '@interfaces/ISendingError.interface';
import type { ITransporterConfiguration } from '@transporters/ITransporterConfiguration.interface';

import type { IInfomaniakError } from './IInformaniakError.interface';
import type { ISmtpBody } from './ISmtpBody.interface';
import type { ISmtpTransport } from './ISmtpTransport.interface';
import type { ISmtpError } from './ISmtpError.interface';
import type { ISmtpResponse } from './ISmtpResponse.interface';

/**
 * Set a Nodemailer SMTP transporter for mail sending.
 *
 * @dependency nodemailer
 *
 * @see https://nodemailer.com/smtp/
 */
export class SmtpTransporter extends Transporter<ISmtpBody> {
  protected readonly transport: ISmtpTransport;

  constructor(transport: ISmtpTransport, configuration: ITransporterConfiguration) {
    super(configuration);
    this.transport = transport;
  }

  build({ ...args }: IMail): ISmtpBody {
    const { payload, body } = args;

    const output: ISmtpBody = {
      from: this.address(payload.meta.from),
      to: this.addresses(payload.meta.to),
      replyTo: this.address(payload.meta.replyTo),
      subject: payload.meta.subject,
      text: body?.text,
      html: body?.html,
    };

    if (typeof payload.meta.cc !== 'undefined') {
      output.cc = this.addresses(payload.meta.cc);
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      output.bcc = this.addresses(payload.meta.bcc);
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      output.attachments = payload.meta.attachments.map((attachment: IAttachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        encoding: 'base64' as const,
      }));
    }

    return output;
  }

  /**
   * @description Format email address according to SMTP requirements
   *
   * @param recipient
   */
  address(recipient: string | IAddressable): string {
    if (typeof recipient === 'string') {
      return recipient;
    }

    return typeof recipient.name !== 'undefined' ? `${recipient.name} <${recipient.email}>` : `<${recipient.email}>`;
  }

  /**
   * @description Format email addresses according to SMTP requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string | IAddressable>): Array<string> {
    return [...recipients].map( (recipient: string | IAddressable) => this.address(recipient) );
  }

  async send(body: ISmtpBody): Promise<SendingResponse> {
    try {
      const info = await this.transport.sendMail(body);
      return this.response(info);
    } catch (err: unknown) {
      throw this.error(err as Error | ISmtpError | IInfomaniakError);
    }
  }

  /**
   * @description Format API response
   *
   * @param response Response from Nodemailer SMTP API
   */
  response(response: ISmtpResponse): SendingResponse {
    const incoming = response;
    const res = new SendingResponse();

    return res
      .set('provider', null)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response.messageId)
      .set('body', incoming.envelope)
      .set('statusCode', 202)
      .set('statusMessage', incoming.response)
      .set('messageId', incoming.messageId);
  }

  /**
   * @description Format error output
   *
   * @param error Error from Nodemailer SMTP API
   *
   * @fixme Non managed error with smtp.gmail.com and secure true : error have a different pattern and this regError.exec(error.response)[0] not working
   */
  error(error: Error | ISmtpError | IInfomaniakError): SendingError {
    if (error instanceof TypeError) {
      return new SendingError(417, error.name, [error.message]);
    }

    const output: ISendingError = {
      errors: ['Unknown error'],
      statusCode: 500,
      statusText: 'SMTP Error',
    };

    if (this.transport.options?.host === 'smtp.gmail.com') {
      const e = error as ISmtpError;

      const regError = /[A-Z]{1}[a-z\s\W]+\./g;
      const matchError = regError.exec(e.response)?.[0];

      output.errors = [matchError ?? 'Unknown error'];
      output.statusText = e.responseCode.toString();
      output.statusCode = e.code;
    }

    if (this.transport.options?.host === 'mail.infomaniak.com') {
      const e = error as IInfomaniakError;

      output.errors = [e.response];
      output.statusText = e.responseCode.toString();
      output.statusCode = Number(e.code);
    }

    if (error instanceof Error) {
      output.errors = [error.message];
    }

    return new SendingError(output.statusCode, output.statusText, output.errors)
  }
}
