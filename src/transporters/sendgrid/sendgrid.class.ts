import { Transporter } from './../transporter.class';

import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { ISendgridResponse } from './ISendgridResponse.interface';
import { ITransporter } from './../ITransporter.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ISendgridError } from './ISendgridError.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';

import { SendingResponse } from './../../classes/sending-response.class';
import { SendingError } from './../../classes/sending-error.class';

import { COMPILER } from './../../types/enums/compiler.enum';

import { Debug } from './../../types/decorators/debug.decorator';

/**
 * Set a Sendgrid transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sendgrid
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sendgrid
 * @see https://sendgrid.com/
 * @see https://sendgrid.com/docs/API_Reference/api_v3.html
 */
export class SendgridTransporter extends Transporter implements ITransporter {

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
   * @description Build body request according to Mailjet requirements
   */
  @Debug('sendgrid')
  build({...args}: IBuildable): Record<string,unknown> {

    const { payload, templateId, body } = args;

    const output = {
      from: this.address(payload.meta.from, 'from'),
      personalizations: [{
        to: this.addresses(payload.meta.to),
      }],
      to: this.addresses(payload.meta.to),
      reply_to: this.address(payload.meta.replyTo),
      subject: payload.meta.subject
    };

    switch(payload.compiler.valueOf()) {
      case COMPILER.provider:
        Object.assign(output, {
          dynamic_template_data: payload.data,
          templateId: payload.meta.templateId || templateId
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
      Object.assign(output.personalizations, { cc: this.addresses(payload.meta.cc) });
    }

    if (typeof(payload.meta.bcc) !== 'undefined') {
      Object.assign(output.personalizations, { bcc: this.addresses(payload.meta.bcc) });
    }

    if (typeof(payload.meta.attachments) !== 'undefined') {
      Object.assign(output, { attachments: payload.meta.attachments });
    }

    return output;
  }

  /**
   * @description Format email address according to Sendgrid requirements
   *
   * @param recipient  Entry to format as email address
   * @param type Discriminator
   */
  address(recipient: string|IAddressable, type?: string): string|IAddressB {
    if (typeof recipient === 'string') {
      return type === 'from' ? recipient : { email: recipient };
    }
    return type === 'from' ? recipient.email : { email: recipient.email, name: recipient.name };
  }

  /**
   * @description Format email addresses according to Sendgrid requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): Array<string|IAddressB> {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient) );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Sendgrid API
   */
  response(response: ISendgridResponse[]): SendingResponse {

    const incoming = response.shift();
    const res = new SendingResponse();

    res
      .set('uri', incoming.request.uri)
      .set('httpVersion', incoming.httpVersion)
      .set('headers', incoming.headers)
      .set('method', incoming.request.method)
      .set('body', incoming.request.body)
      .set('statusCode', 202)
      .set('statusMessage', incoming.statusMessage);

    return res;
  }

  /**
   * @description Format error output
   *
   * @param error Error from Sendgrid API
   */
  error(error: ISendgridError): SendingError {
    console.log('ERR', error)
    return new SendingError(error.code || error.statusCode, error.name || error.message, error.hasOwnProperty('response') ? error.response.body.errors : [error.message]);
  }
}