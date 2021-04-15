import { Transporter } from '../transporter.class';

import { ITransporter } from '../ITransporter.interface';
import { IAttachment } from '../../types/interfaces/IAttachment.interface';
import { ISparkpostError } from './ISparkpostError.interface';
import { IBuildable } from '../../types/interfaces/IBuildable.interface';
import { IAddressable } from '../../types/interfaces/addresses/IAddressable.interface';
import { ISparkpostBody } from './ISparkpostBody.interface';
import { IAddressD } from '../../types/interfaces/addresses/IAddressD.interface';
import { ISendMail } from '../../types/interfaces/ISendMail.interface';

import { SendingError } from '../../classes/sending-error.class';
import { SendingResponse } from '../../classes/sending-response.class';

import { COMPILER } from '../../types/enums/compiler.enum';

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
export class SparkpostTransporter extends Transporter implements ITransporter {

  /**
   * @description Wrapped concrete transporter instance
   */
  public transporter: ISendMail;

   /**
    * @description
    *
    * @param transporterEngine
    * @param domain Domain which do the request
    */
  constructor( transporterEngine: ISendMail ) {
    super();
    this.transporter = transporterEngine;
  }

  /**
   * @description Build body request according to Sparkpost requirements
   */
  build({...args }: IBuildable): ISparkpostBody {

    const { payload, templateId, body } = args;

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

    switch(payload.compiler.valueOf()) {
      case COMPILER.provider:
        Object.assign(output, {
          substitution_data: payload.data,
        });
        Object.assign(output.content, {
          template_id: templateId,
          use_draft_template: false
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
  response(response: Record<string,unknown>): SendingResponse {

    const res = new SendingResponse();

    res
      .set('uri', null)
      .set('httpVersion', null)
      .set('headers', null)
      .set('method', 'POST')
      .set('body', response)
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

