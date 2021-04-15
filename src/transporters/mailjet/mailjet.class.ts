import { Transporter } from './../transporter.class';

import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressA } from './../../types/interfaces/addresses/IAddressA.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IMailjetResponse } from './IMailjetResponse.interface';
import { IMailjetError } from './IMailjetError.interface';
import { IMailjetErrorMessage } from './IMailjetErrorMessage.interface';
import { ITransporter } from './../ITransporter.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { COMPILER } from './../../types/enums/compiler.enum';

import { getMailjetErrorMessages } from './../../utils/error.util';

import { Debug } from './../../types/decorators/debug.decorator';

/**
 * Set a Mailjet transporter for mail sending.
 *
 * @dependency node-mailjet
 *
 * @see https://fr.mailjet.com/
 * @see https://github.com/mailjet/mailjet-apiv3-nodejs
 * @see https://dev.mailjet.com/guides/
 */
export class MailjetTransporter extends Transporter implements ITransporter {

  /**
   * @description Wrapped concrete transporter instance
   */
  public transporter: ISendMail;

  /**
   * @description
   *
   * @param transporterEngine
   */
  constructor( transporterEngine: ISendMail ) {
    super();
    this.transporter = transporterEngine;
  }

  /**
   * @description Build body request according to Mailjet requirements
   */
  @Debug('mailjet')
  build({...args}: IBuildable): Record<string,unknown> {

    const { payload, templateId, body } = args;

    const output = {
      Messages: [{
        From: this.address(payload.meta.from),
        To: this.addresses(payload.meta.to),
        'h:Reply-To': this.address(payload.meta.from),
        Subject: payload.meta.subject
      }]
    };

    switch(payload.compiler.valueOf()) {
      case COMPILER.provider:
        Object.assign(output.Messages[0], { Variables: payload.data });
        Object.assign(output.Messages[0], { TemplateLanguage: true });
        Object.assign(output.Messages[0], { TemplateID: parseInt(templateId, 10) });
        break;
      case COMPILER.default:
      case COMPILER.self:
        Object.assign(output.Messages[0], {
          TextPart: body.text,
          HTMLPart: body.html
        });
        break;
    }

    if (typeof(payload.meta.cc) !== 'undefined') {
      Object.assign(output.Messages[0], { Cc: this.addresses(payload.meta.cc) });
    }

    if (typeof(payload.meta.bcc) !== 'undefined') {
      Object.assign(output.Messages[0], { Bcc: this.addresses(payload.meta.bcc) });
    }

    if (typeof(payload.meta.attachments) !== 'undefined') {
      Object.assign(output.Messages[0], {
        Attachments: payload.meta.attachments.map( (attachment: IAttachment) => {
          return {
            ContentType: attachment.type,
            Filename: attachment.filename,
            Base64Content: attachment.content
          };
        })
      });
    }

    return output;
  }

  /**
   * @description Format email address according to Mailjet requirements
   *
   * @param recipient
   */
  address(recipient: string|IAddressable): IAddressA {
    if (typeof recipient === 'string') {
      return { Email: recipient };
    }
    return typeof recipient.name !== 'undefined' ? { Email: recipient.email, Name: recipient.name } : { Email: recipient.email };
  }

  /**
   * @description Format email addresses according to Mailjet requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): IAddressA[] {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient) );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Mailjet API
   */
  response(response: IMailjetResponse): SendingResponse {

    const incoming = response.response;

    const res = new SendingResponse();

    res
      .set('uri', `${incoming.res.connection.servername} ${incoming.res.req.path}`)
      .set('httpVersion', incoming.res.httpVersion)
      .set('headers', incoming.res.headers)
      .set('method', incoming.req.method)
      .set('body', incoming.body)
      .set('statusCode', 202)
      .set('statusMessage', incoming.res.statusMessage);

    return res;
  }

  /**
   * @description Format error output
   *
   * @param error Error from Mailgun API
   */
  error(error: IMailjetError): SendingError {
    const err = JSON.parse(error.response.res.text) as { ErrorMessage?: string, Messages?: IMailjetErrorMessage[] };
    const messages = err.ErrorMessage ? err.ErrorMessage : getMailjetErrorMessages(err.Messages);
    return new SendingError(error.statusCode, error.ErrorMessage, Array.isArray(messages) ? messages: [messages] );
  }

}