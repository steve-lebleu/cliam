import { Attachment, EmailParams, Sender, Recipient } from "mailersend";

import { Container } from './../../services/container.service';

import { Transporter } from './../transporter.class';

import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IMailersendResponse } from './IMailersendResponse.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';

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
   * @param transporterEngine
   * @param domain Domain which do the request
   */
  constructor( transporterEngine: ISendMail ) {
    super(transporterEngine);
  }

  /**
   * @description Build body request according to Mailersend requirements
   */
  build({...args }: IBuildable): Record<string,unknown> {

    const { payload, templateId, body } = args;

    const from = new Sender(this.address(payload.meta.from).email, this.address(payload.meta.from)?.name);
    const recipients = payload.meta.to.map(to => new Recipient(to.email, to.name));
    
    const params = new EmailParams()
      .setFrom(from)
      .setTo(recipients)
      .setReplyTo(from)
      .setSubject(payload.meta.subject);

    switch(payload.renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        params
          .setPersonalization([{ email: this.address(payload.meta.to[0]).email, data: [ payload.data as any ] }])
          .setTemplateId(templateId);
        break;
      case RENDER_ENGINE.default:
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

    return params as any;
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

    console.log(response);
    const res = new SendingResponse();

    res
      .set('uri', null)
      .set('httpVersion', null)
      .set('headers', JSON.stringify(response.headers))
      .set('method', null)
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
  error(error: any): SendingError {
    return new SendingError(parseInt(error.statusCode, 10), error.body.message, [error.body.errors]);
  }
}