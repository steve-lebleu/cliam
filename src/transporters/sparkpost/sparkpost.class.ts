import { Transporter } from '../transporter.class';

import { ITransporterConfiguration } from './../ITransporterConfiguration.interface';
import { IAttachment } from '../../types/interfaces/IAttachment.interface';
import { ISparkpostError } from './ISparkpostError.interface';
import { ISparkpostResponse } from './ISparkpostResponse.interface';
import { ISparkpostBody } from './ISparkpostBody.interface';
import { IMail } from '../../types/interfaces/IMail.interface';
import { IAddressable } from '../../types/interfaces/addresses/IAddressable.interface';
import { IAddressD } from '../../types/interfaces/addresses/IAddressD.interface';
import { ITransporterMailer } from '../ITransporterMailer.interface';

import { SendingError } from '../../classes/sending-error.class';
import { SendingResponse } from '../../classes/sending-response.class';

import { RENDER_ENGINE } from '../../types/enums/render-engine.enum';
import { PROVIDER } from '../../types/enums/provider.enum';
import { MODE } from '../../types/enums/mode.enum';

/**
 * Set a Sparkpost transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sparkpost-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sparkpost-transport
 * @see https://app.sparkpost.com
 * @see https://developers.sparkpost.com/api/
 */
export class SparkpostTransporter extends Transporter {

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
   * @description Build body request according to Sparkpost requirements
   */
  build({...args }: IMail): ISparkpostBody {

    const { payload, templateId, body, renderEngine } = args;

    let cc: IAddressD[] = [];
    let bcc: IAddressD[] = [];

    const output = {
      recipients: this.addresses(payload.meta.to),
      content: {
        from: payload.meta.from,
        subject: payload.meta.subject,
        reply_to: `${payload.meta.replyTo.name} <${payload.meta.replyTo.email}>`,
      }
    };

    switch(renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          substitution_data: payload.data,
        });
        Object.assign(output.content, {
          template_id: templateId,
          use_draft_template: false
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
      cc = payload.meta.cc.map( (recipient: string|IAddressable) => {
        const addr = this.address(recipient);
        const primary = payload.meta.to[0];
        Object.assign(addr, { header_to: typeof primary === 'string' ? primary : primary.email });
        return addr;
      });
      output.recipients = [].concat(output.recipients).concat(cc) as IAddressD[];
    }

    if (typeof(payload.meta.bcc) !== 'undefined') {
      bcc = payload.meta.bcc.map( (recipient: string|IAddressable) => {
        const addr = this.address(recipient);
        const primary = payload.meta.to[0];
        Object.assign(addr, { header_to: typeof primary === 'string' ? primary : primary.email });
        return addr;
      });
      output.recipients = [].concat(output.recipients).concat(bcc) as IAddressD[];
    }

    if(cc.length > 0 && bcc.length > 0) {
      Object.assign(output.content, {
        headers: {
          CC: cc.map( (recipient: IAddressD) => recipient.email)
        }
      });
    }

    if (typeof(payload.meta.attachments) !== 'undefined') {
      Object.assign(output.content, {
        attachments: payload.meta.attachments.map( (attachment: IAttachment) => {
          return {
            name: attachment.filename,
            type: attachment.type,
            data: attachment.content
          };
        })
      });
    }

    return output;
  }

  /**
   * @description Format email address according to Sparkpost requirements
   *
   * @param recipient
   */
  address(recipient: string|IAddressable): IAddressD {
    return { address: recipient };
  }

  /**
   * @description Format email addresses according to Sparkpost requirements
   *
   * @param recipients Entries to format as email address
   */
  addresses(recipients: Array<string|IAddressable>): IAddressD[] {
    return [...recipients].map( (recipient: string|IAddressable) => this.address(recipient) );
  }

  /**
   * @description Format API response
   *
   * @param response Response from Sparkpost API
   */
  response(response: ISparkpostResponse): SendingResponse {

    const res = new SendingResponse();

    res
      .set('mode', MODE.api)
      .set('provider', PROVIDER.sparkpost)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response.messageId)
      .set('body', null)
      .set('statusCode', 202)
      .set('statusMessage', null);

    return res;

  }

  /**
   * @description Format error output
   *
   * @param error Error from Sparkpost API
   */
  error(error: ISparkpostError): SendingError {
    return new SendingError(error.statusCode, error.errors[0].message, [ error.errors[0]?.description || '' ]);
  }
}

