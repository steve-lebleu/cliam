import { Transporter } from '@transporters/transporter.class';

import { IBuildable } from '@interfaces/IBuildable.interface';
import { IMailgunError } from '@transporters/mailgun/IMailgunError.interface';
import { IAttachment } from '@interfaces/IAttachment.interface';
import { IAddressable } from '@interfaces/addresses/IAddressable.interface';
import { ITransporter } from '@transporters/ITransporter.interface';
import { ISendMail } from '@interfaces/ISendMail.interface';

import { SendingError } from '@classes/sending-error.class';
import { SendingResponse } from '@classes/sending-response.class';

import { COMPILER } from '@enums/compiler.enum';

/**
 * This class set a Mailgun transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-mailgun-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-mailgun-transport
 * @see https://documentation.mailgun.com/en/latest/index.html
 */
export class MailgunTransporter extends Transporter implements ITransporter {

  /**
   * @description Wrapped concrete transporter instance
   */
  public transporter: ISendMail;

  /**
   * @description
   *
   * @param transporterEngine
   * @param domain Domain which do the request
   */
  constructor( transporterEngine: ISendMail ) {
    super();
    this.transporter = transporterEngine;
  }

  /**
   * @description Format email address according to Mailgun requirements
   *
   * @param recipient
   */
  address(recipient: string|IAddressable): string {
    if (typeof recipient === 'string') {
      return recipient;
    }
    return typeof recipient.name !== 'undefined' ? `${recipient.name} <${recipient.email}>` : recipient.email;
  }

  /**
   * @description Format email addresses according to Mailgun requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): Array<string> {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient) );
  }

  /**
   * @description Build body request according to Mailgun requirements
   */
  build({...args}: IBuildable): Record<string,unknown> {

    const { payload, templateId, body } = args;

    const output = {
      from: this.address(payload.meta.from),
      to: this.addresses(payload.meta.to),
      'h:Reply-To': this.address(payload.meta.replyTo),
      subject: payload.meta.subject
    };

    switch(payload.compiler.valueOf()) {
      case COMPILER.provider:
        Object.assign(output, {
          'h:X-Mailgun-Variables': JSON.stringify(payload.data),
          template: templateId
        });
        break;
      case COMPILER.default:
      case COMPILER.self:
        Object.assign(output, {
          text: body.text,
          html: body.html
        });
        break;
    }

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

    return output;
  }

  /**
   * @description Format API response
   *
   * @param response Response from Mailgun API
   */
  response(response: Record<string,unknown>): SendingResponse {
    const res = new SendingResponse();
    res
      .set('uri', null)
      .set('httpVersion', null)
      .set('headers', null)
      .set('method', 'POST')
      .set('body', response)
      .set('statusCode', 202)
      .set('statusMessage', response.message as string);
    return res;
  }

  /**
   * @description Format error output
   *
   * @param error Error from Mailgun API
   */
  error(error: IMailgunError): SendingError {
    return new SendingError(error.statusCode, error.name || error.message, [error.message]);
  }
}