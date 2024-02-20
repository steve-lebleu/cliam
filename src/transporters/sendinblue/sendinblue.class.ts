import { Transporter } from './../transporter.class';

import { ITransporterConfiguration } from './../ITransporterConfiguration.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { ISendinblueResponse } from './ISendinblueResponse.interface';
import { IAttachment } from './../../types/interfaces/IAttachment.interface';
import { IMail } from './../../types/interfaces/IMail.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ITransporterMailer } from './../ITransporterMailer.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';

/**
 * Set a Sendinblue transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sendinblue-transport
 * @dependency Fork of nodemailer-sendinblue-transport https://github.com/konfer-be/nodemailer-sendinblue-transport.git
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sendinblue-transport
 * @see https://fr.sendinblue.com/
 * @see https://apidocs.sendinblue.com/tutorial-sending-transactional-email/
 *
 */
export class SendinblueTransporter extends Transporter {

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
  build({...args }: IMail): Record<string,unknown> {

    const { payload, templateId, body, renderEngine } = args;

    const output = {
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      to: this.addresses(payload.meta.to),
      from: this.address(payload.meta.from),
      replyTo: this.address(payload.meta.replyTo),
      subject: payload.meta.subject
    };

    switch(renderEngine.valueOf()) {
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
   * @description Format email address according to Sendinblue requirements
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
   * @description Format email addresses according to Sendinblue requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): Array<IAddressB> {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient) );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Sendinblue API
   */
  response(response: ISendinblueResponse): SendingResponse {

    const res = new SendingResponse();

    res
      .set('uri', null)
      .set('httpVersion', response.res.httpVersion)
      .set('headers', response.res.headers)
      .set('method', response.res.method)
      .set('body', response.body)
      .set('statusCode', 202)
      .set('statusMessage', response.res.statusMessage);

    return res;
  }

  /**
   * @description Format error output
   *
   * @param error Error from Sendgrid API
   */
  error(error: Error): SendingError {
    const errorCode = /[0-9]+/;
    const statusCode = errorCode.exec(error.message);
    return new SendingError(parseInt(statusCode[0], 10), error.name, [error.message]);
  }
}