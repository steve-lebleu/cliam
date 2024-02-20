import { Transporter } from './../transporter.class';

import { ITransporterConfiguration } from './../ITransporterConfiguration.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IMail } from './../../types/interfaces/IMail.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IPostmarkError } from './IPostmarkError.interface';
import { IPostmarkResponse } from './IPostmarkResponse.interface';
import { ITransporterMailer } from './../ITransporterMailer.interface';

import { SendingResponse } from './../../classes/sending-response.class';
import { SendingError } from './../../classes/sending-error.class';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';
import { PROVIDER } from '../../types/enums/provider.enum';
import { MODE } from '../../types/enums/mode.enum';

import { IPostmarkBody } from './IPostmarkBody.interface';

import { Debug } from './../../types/decorators/debug.decorator';

/**
 * Set a Postmark transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-postmark-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-postmark-transport
 * @see https://postmarkapp.com/developer
 */
export class PostmarkTransporter extends Transporter {

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
  @Debug('postmark')
  build({...args}: IMail): IPostmarkBody {

    const { payload, templateId, body, renderEngine } = args;

    const output: IPostmarkBody = {
      from: this.address(payload.meta.from),
      to: this.addresses(payload.meta.to),
      replyTo: this.address(payload.meta.replyTo),
      subject: payload.meta.subject
    };

    switch(renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          templateModel: payload.data,
          templateId: parseInt(templateId, 10),
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
            contentTransferEncoding: 'base64',
            content: attachment.content,
            filename: attachment.filename,
            cid: 'cid:' + attachment.filename
          }
        })
      });
    }

    return output;
  }

  /**
   * @description Format email address according to Postmark requirements
   *
   * @param recipient
   */
  address(recipient: string|IAddressable): string {
    if (typeof recipient === 'string') {
      return recipient;
    }
    return typeof recipient.name !== 'undefined' ? `${recipient.name} ${recipient.email}` : recipient.email;
  }

  /**
   * @description Format email addresses according to Postmark requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): Array<string> {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient) );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Postmark API
   */
  response(response: IPostmarkResponse): SendingResponse {

    const res = new SendingResponse();

    res
      .set('mode', MODE.api)
      .set('provider', PROVIDER.postmark)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response.messageId)
      .set('body', JSON.stringify(response.accepted))
      .set('statusCode', 202)
      .set('statusMessage', null);

    return res;
  }

  /**
   * @description Format error output
   *
   * @param error Error from Postmark API
   */
  error(error: IPostmarkError): SendingError {
    return new SendingError(error.statusCode || error.code, error.name || error.message, error.hasOwnProperty('response') ? error.response.body.errors : [error.message]);
  }
}