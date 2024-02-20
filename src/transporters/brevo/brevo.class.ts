import { Transporter } from './../transporter.class';

import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IBrevoResponse } from './IBrevoResponse.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';

/**
 * Set a Brevo transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-brevo-transport
 * @dependency Fork of nodemailer-sendinblue-transport https://github.com/konfer-be/nodemailer-sendinblue-transport.git
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-brevo-transport
 * @see https://app.brevo.com/
 *
 */
export class BrevoTransporter extends Transporter {

  /**
   * @description
   *
   * @param transporterEngine
   * @param domain Domain which do the request
   */
  constructor( transporterEngine: ISendMail ) {
    super(transporterEngine);
  }

  /**
   * @description Build body request according to Brevo requirements
   */
  build({...args }: IBuildable): Record<string,unknown> {

    const { payload, templateId, body } = args;

    const output = {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      to: this.addresses(payload.meta.to),
      from: payload.meta.from,
      'reply-to': this.address(payload.meta.replyTo),
      subject: payload.meta.subject
    };

    switch(payload.renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          params: payload.data,
          templateId: parseInt(templateId, 10)
        });
        break;
      case RENDER_ENGINE.default:
      case RENDER_ENGINE.self:
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
            content : attachment.content,
            filename: attachment.filename,
            name: attachment.filename
          }
        })
      });
    }

    return output;
  }

  /**
   * @description Format email address according to Brevo requirements
   *
   * @param recipient  Entry to format as email address
   */
  address(recipient: string|IAddressable): IAddressB {
    if (typeof recipient === 'string') {
      return { email: recipient };
    }
    return recipient as IAddressB;
  }

  /**
   * @description Format email addresses according to Brevo requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): Array<string> {
    return [...recipients].map( (recipient: IAddressable) => recipient.email );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Brevo API
   */
  response(response: IBrevoResponse): SendingResponse {

    const res = new SendingResponse();

    res
      .set('uri', null)
      .set('httpVersion', null)
      .set('headers', null)
      .set('method', null)
      .set('body', response.messageId)
      .set('statusCode', 202)
      .set('statusMessage', null);

    return res;
  }

  /**
   * @description Format error output
   *
   * @param error Error from Brevo API
   */
  error(error: Error): SendingError {
    console.log(error)
    const errorCode = /[0-9]+/;
    const statusCode = errorCode.exec(error.message);
    return new SendingError(parseInt(statusCode[0], 10), error.name, [error.message]);
  }
}