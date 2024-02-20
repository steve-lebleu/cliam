import { Transporter } from './../transporter.class';

import { ITransporterConfiguration } from './../ITransporterConfiguration.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { IMandrillResponse } from 'transporters/mandrill/IMandrillResponse.interface';
import { ITransporterMailer } from './../ITransporterMailer.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';

/**
 * Set a Mandrill transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-mandrill-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-mandrill-transport
 * @see https://mandrillapp.com/api/docs/
 * @see https://bitbucket.org/mailchimp/mandrill-api-node/src
 */
export class MandrillTransporter extends Transporter {

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
   * @description Build body request according to Mailgun requirements
   */
  build({...args}: IBuildable): Record<string,unknown> {

    const { payload, templateId, body } = args;

    const output = {
      message: {
        subject: payload.meta.subject,
        from_email: this.address(payload.meta.from.email, 'single'),
        from_name: payload.meta.from.name,
        to: this.addresses(payload.meta.to, 'to'),
        headers: {
          'Reply-To': this.address(payload.meta.replyTo, 'single')
        },
        track_opens: true,
        track_click: true,
        preserve_recipients: true
      }
    };

    switch(payload.renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          template_content: [payload.data],
          template_name: payload.meta.templateId || templateId
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
      output.message.to = [].concat(output.message.to).concat(this.addresses(payload.meta.cc, 'cc')) as Array<string|IAddressB>
    }

    if (typeof(payload.meta.bcc) !== 'undefined') {
      output.message.to = [].concat(output.message.to).concat(this.addresses(payload.meta.bcc, 'bcc')) as Array<string|IAddressB>
    }

    if (typeof(payload.meta.attachments) !== 'undefined') {
      Object.assign(output.message, { attachments: payload.meta.attachments.map( (attachment: IAttachment) => {
        return { type: attachment.type, name: attachment.filename, content: attachment.content };
      } ) });
    }

    return output;
  }

  /**
   * @description Format email address according to Mandrill requirements
   *
   * @param recipient Entry to format as email address
   * @param type type Discriminator for body property settings
   */
  address(recipient: string|IAddressable, type?: string): string|IAddressB {
    if (typeof recipient === 'string') {
      return recipient;
    }
    if (type === 'single') {
      return recipient.email;
    }
    return typeof recipient.name !== 'undefined' ? { email: recipient.email, name: recipient.name, type } : { email: recipient.email };
  }

  /**
   * @description Format email addresses according to Mandrill requirements
   *
   * @param recipients Entries to format as email address
   * @param type Discriminator for body property settings
   */
  addresses(recipients: Array<string|IAddressable>, type?: string): Array<string|IAddressB> {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient, type) );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Mandrill API
   */
  response(response: IMandrillResponse[]): SendingResponse {

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
   * @param error Error from Mandrill API
   */
  error(error: Error): SendingError {
    return new SendingError(500, '', ['']);
  }
}