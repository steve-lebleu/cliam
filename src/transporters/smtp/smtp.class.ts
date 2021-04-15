import { Transporter } from '@transporters/transporter.class';

import { IAddressable } from '@interfaces/addresses/IAddressable.interface';
import { ISMTPResponse } from '@transporters/smtp/ISMTPResponse.interface';
import { IAttachment } from '@interfaces/IAttachment.interface';
import { IBuildable } from '@interfaces/IBuildable.interface';
import { IGmailError } from '@transporters/smtp/IGmailError.interface';
import { IInfomaniakError } from '@transporters/smtp/IInformaniakError.interface';
import { ISMTPError } from '@transporters/smtp/ISMTPError.interface';
import { ITransporter } from '@transporters/ITransporter.interface';
import { ISendMail } from '@interfaces/ISendMail.interface';

import { SendingError } from '@classes/sending-error.class';
import { SendingResponse } from '@classes/sending-response.class';

import { HTTP_METHOD } from '@enums/http-method.enum';
import { Debug } from '@decorators/debug.decorator';

/**
 * Set a Nodemailer SMTP transporter for mail sending.
 *
 * @dependency nodemailer
 *
 * @see https://nodemailer.com/smtp/
 */
export class SmtpTransporter extends Transporter implements ITransporter {

  /**
   * @description Wrapped concrete transporter instance
   */
  public transporter: ISendMail;

  /**
   * @description
   */
  constructor( transporterEngine: ISendMail ) {
    super();
    this.transporter = transporterEngine;
  }

  /**
   * @description Build body request according to Mailjet requirements
   */
  @Debug('smtp')
  build({...args }: IBuildable): Record<string,unknown> {

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
  address(recipient: string|IAddressable): string {
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
  addresses(recipients: Array<string|IAddressable>): Array<string> {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient) );
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
      .set('accepted', incoming.accepted)
      .set('uri', null)
      .set('httpVersion', null)
      .set('headers', null)
      .set('method', HTTP_METHOD.POST)
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
  error(error: Error|IGmailError|IInfomaniakError|ISMTPError): SendingError {

    if (error instanceof TypeError) {
      return new SendingError(417, error.name, [error.message]);
    }

    if (this.transporter.options.host === 'smtp.gmail.com') {

      error = error as IGmailError;

      const regError = /[A-Z]{1}[a-z\s\W]+\./g;
      const matchError = regError.exec(error.response)[0];
      const regHelp = /https:\/\/[a-z-A-Z0-9\w\.-\/\?\=]+/g;
      const matchHelp = regHelp.exec(error.response)[0];

      return new SendingError(error.responseCode, error.code.toString(), [matchError]);
    }

    if (this.transporter.options.host === 'mail.infomaniak.com') {
      error = error as IInfomaniakError;
      return new SendingError(403, error.errno.toString(), [ error.errno.toString() ]);
    }

    error = error as ISMTPError;

    return new SendingError(error.responseCode, error.code.toString(), [error.response])
  }
}