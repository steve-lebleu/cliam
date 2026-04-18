import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { Transporter } from '@transporters/transporter.class';

import { Debug } from '@decorators/debug.decorator';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/addresses/IAddressable.interface';
import type { ISendingError } from '@interfaces/ISendingError.interface';

import type { IGmailError } from './IGmailError.interface';
import type { IInfomaniakError } from './IInformaniakError.interface';
import type { ISMTPError } from './ISMTPError.interface';
import type { ISMTPResponse } from './ISMTPResponse.interface';

/**
 * Set a Nodemailer SMTP transporter for mail sending.
 *
 * @dependency nodemailer
 *
 * @see https://nodemailer.com/smtp/
 */
export class SmtpTransporter extends Transporter {
  /**
   * @description Build body request according to Mailjet requirements
   */
  @Debug('smtp')
  build({...args }: IMail): Record<string,unknown> {
    const { payload, body } = args;

    const output = {
      from: this.address(payload.meta.from),
      to: this.addresses(payload.meta.to),
      replyTo: this.address(payload.meta.replyTo),
      subject: payload.meta.subject
    };

    if (typeof(payload.meta.cc) !== 'undefined') {
      Object.assign(output, { cc: this.addresses(payload.meta.cc) });
    }

    if (typeof(payload.meta.bcc) !== 'undefined') {
      Object.assign(output, { bcc: this.addresses(payload.meta.bcc) });
    }

    if (typeof(payload.meta.attachments) !== 'undefined') {
      Object.assign(output, {
        attachments: payload.meta.attachments.map( (attachment: IAttachment) => {
          return {
            filename: attachment.filename,
            content: attachment.content,
            encoding: 'base64'
          };
        })
      });
    }

    Object.assign(output, {
      text: body.text,
      html: body.html
    });

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

  /**
   * @description Format API response
   *
   * @param response Response from Nodemailer SMTP API
   */
  response(response: ISMTPResponse): SendingResponse {
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
  error(error: Error | IGmailError | IInfomaniakError | ISMTPError): SendingError {
    if (error instanceof TypeError) {
      return new SendingError(417, error.name, [error.message]);
    }

    const output: ISendingError = {
      errors: [],
      statusCode: null,
      statusText: null,
    };

    if (this.transporter.options.host === 'smtp.gmail.com') {
      const e = error as IGmailError;

      const regError = /[A-Z]{1}[a-z\s\W]+\./g;
      const matchError = regError.exec(e.response)[0];

      output.errors = [matchError];
      output.statusText = e.responseCode.toString();
      output.statusCode = e.code;
    }

    if (this.transporter.options.host === 'mail.infomaniak.com') {
      const e = error as IInfomaniakError;

      output.errors = [e.response];
      output.statusText = e.responseCode.toString();
      output.statusCode = Number(e.code);
    }

    return new SendingError(output.statusCode, output.statusText, output.errors)
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse | SendingError> {
    try {
      const info = await this.transporter.sendMail(body);
      return this.response(info);
    } catch (err) {
      return this.error(err);
    }
  }
}
