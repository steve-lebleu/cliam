import { Transporter } from './../transporter.class';

import { ITransporterConfiguration } from './../ITransporterConfiguration.interface';
import { IMail } from './../../types/interfaces/IMail.interface';
import { ISendgridResponse } from './ISendgridResponse.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ISendgridError } from './ISendgridError.interface';
import { ITransporterMailer } from './../ITransporterMailer.interface';

import { SendingResponse } from './../../classes/sending-response.class';
import { SendingError } from './../../classes/sending-error.class';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';
import { PROVIDER } from '../../types/enums/provider.enum';
import { MODE } from '../../types/enums/mode.enum';

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
export class SendgridTransporter extends Transporter {

  /**
   * @description
   *
   * @param transporterEngine Transporter instance
   * @param configuration Transporter configuration
   */
  constructor( transporterEngine: ITransporterMailer, configuration: ITransporterConfiguration ) {
    super(transporterEngine, configuration);
  }

  /**
   * @description Build body request according to Mailjet requirements
   */
  @Debug('sendgrid')
  build({...args}: IMail): Record<string,unknown> {

    const { payload, templateId, body, renderEngine } = args;

    const output = {
      from: this.address(payload.meta.from, 'from'),
      personalizations: [{
        to: this.addresses(payload.meta.to),
      }],
      to: this.addresses(payload.meta.to),
      reply_to: this.address(payload.meta.replyTo),
      subject: payload.meta.subject
    };

    switch(renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          dynamic_template_data: payload.data,
          templateId: payload.meta.templateId || templateId
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
      .set('mode', MODE.api)
      .set('provider', PROVIDER.sendgrid)
      .set('server', incoming.headers['server'] as string)
      .set('uri', incoming.request.uri.href)
      .set('headers', incoming.headers)
      .set('timestamp', Date.now())
      .set('messageId', incoming.headers['x-message-id'] as string)
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
    return new SendingError(error.code || error.statusCode, error.name || error.message, error.hasOwnProperty('response') ? error.response.body.errors : [error.message]);
  }
}