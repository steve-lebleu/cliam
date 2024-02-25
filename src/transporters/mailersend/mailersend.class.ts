import { Attachment, EmailParams, Sender, Recipient } from "mailersend";

import { Transporter } from './../transporter.class';

import { ITransporterConfiguration } from './../ITransporterConfiguration.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IMailersendBody } from './IMailersendBody.interface';
import { IMailersendResponse } from './IMailersendResponse.interface';
import { IMailersendError } from './IMailersendError.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IMail } from './../../types/interfaces/IMail.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ITransporterMailer } from './../ITransporterMailer.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { Debug } from '../../types/decorators/debug.decorator';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';
import { PROVIDER } from '../../types/enums/provider.enum';

/**
 * Set a Mailersend transporter for mail sending.
 *
 * @see https://www.npmjs.com/package/mailersend
 * @see https://app.mailersend.com/
 *
 */
export class MailersendTransporter extends Transporter {

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
   * @description Build body request according to Mailersend requirements
   */
  @Debug('mailersend')
  build({...args }: IMail): Record<string,unknown> {

    const { payload, templateId, body, renderEngine } = args;

    const from = new Sender(this.address(payload.meta.from).email, this.address(payload.meta.from)?.name);
    const recipients = payload.meta.to.map(to => new Recipient(to.email, to.name));
    
    const params = new EmailParams()
      .setFrom(from)
      .setTo(recipients)
      .setReplyTo(from)
      .setSubject(payload.meta.subject);

    switch(renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        params
          .setPersonalization([{ email: this.address(payload.meta.to[0]).email, data: [ payload.data as any ] }])
          .setTemplateId(templateId);
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        params
          .setText(body.text)
          .setHtml(body.html);
        break;
    }

    if (typeof(payload.meta.cc) !== 'undefined') {
      params.setCc(this.addresses(payload.meta.cc))
    }

    if (typeof(payload.meta.bcc) !== 'undefined') {
      params.setBcc(this.addresses(payload.meta.bcc))
    }

    if (typeof(payload.meta.attachments) !== 'undefined') {
      const attachments = payload.meta.attachments.map( (attachment: IAttachment) => {
        return new Attachment(attachment.content, attachment.filename, attachment.filename);
      })
      params.setAttachments(attachments);
    }

    return params as any; // TODO as any is not acceptable
  }

  /**
   * @description Format email address according to Mailersend requirements
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
   * @description Format email addresses according to Mailersend requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): Array<IAddressable> {
    return [...recipients].map( (recipient: IAddressable) => ({ email: recipient.email, name: recipient.name }) );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Mailersend API
   */
  response(response: IMailersendResponse): SendingResponse {

    const res = new SendingResponse();

    res
      .set('provider', PROVIDER.mailersend)
      .set('server', response.headers['server'])
      .set('uri', null)
      .set('headers', JSON.stringify(response.headers))
      .set('timestamp', Date.now())
      .set('messageId', response.headers['x-message-id'])
      .set('body', response.body)
      .set('statusCode', 202)
      .set('statusMessage', null);

    return res;
  }

  /**
   * @description Format error output
   *
   * @param error Error from Mailersend API
   */
  error(error: IMailersendError): SendingError {
    return new SendingError(error.statusCode, error.body.message, [error.body.errors]);
  }
}