import { Transporter } from './../transporter.class';

import { ITransporterConfiguration } from './../ITransporterConfiguration.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressA } from './../../types/interfaces/addresses/IAddressA.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IMail } from './../../types/interfaces/IMail.interface';
import { IMailjetResponse } from './IMailjetResponse.interface';
import { IMailjetError } from './IMailjetError.interface';
import { IMailjetErrorMessage } from './IMailjetErrorMessage.interface';
import { ITransporterMailer } from './../ITransporterMailer.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { Debug } from './../../types/decorators/debug.decorator';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';
import { PROVIDER } from '../../types/enums/provider.enum';

import { getMailjetErrorMessages } from './../../utils/error.util';

/**
 * Set a Mailjet transporter for mail sending.
 *
 * @dependency node-mailjet
 *
 * @see https://fr.mailjet.com/
 * @see https://github.com/mailjet/mailjet-apiv3-nodejs
 * @see https://dev.mailjet.com/guides/
 */
export class MailjetTransporter extends Transporter {

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
  @Debug('mailjet')
  build({...args}: IMail): Record<string,unknown> {

    const { payload, templateId, body, renderEngine } = args;

    const output = {
      Messages: [{
        From: this.address(payload.meta.from),
        To: this.addresses(payload.meta.to),
        'h:Reply-To': this.address(payload.meta.replyTo),
        Subject: payload.meta.subject
      }]
    };

    switch(renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output.Messages[0], { Variables: payload.data });
        Object.assign(output.Messages[0], { TemplateLanguage: true });
        Object.assign(output.Messages[0], { TemplateID: parseInt(templateId, 10) });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
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
      .set('provider', PROVIDER.mailjet)
      .set('server', null)
      .set('uri', incoming.config.url)
      .set('headers', incoming.config.headers)
      .set('timestamp', Date.now())
      .set('messageId', incoming.headers['x-mj-request-guid'])
      .set('body', incoming.config.data)
      .set('statusCode', incoming.status === 200 ? 202 : incoming.status)
      .set('statusMessage', incoming.statusText);

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