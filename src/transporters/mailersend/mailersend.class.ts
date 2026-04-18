import type { IAttachment } from './../../types/interfaces/IAttachment.interface';
import type { IMail } from './../../types/interfaces/IMail.interface';
import type { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import type { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import type { IMailersendError } from './IMailersendError.interface';
import type { HttpResult } from '@services/http.service';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { Debug } from '../../types/decorators/debug.decorator';

import { PROVIDER } from '@enums/provider.enum';
import { RENDER_ENGINE } from '@enums/render-engine.enum';

import { HttpTransporter } from './../http.transporter';

/**
 * Mailersend transporter — sends via the Mailersend API (https://api.mailersend.com/v1/email).
 *
 * @see https://app.mailersend.com/
 * @see https://developers.mailersend.com/api/v1/email.html
 */
export class MailersendTransporter extends HttpTransporter {
  @Debug('mailersend')
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    const output: Record<string, unknown> = {
      from: this.address(payload.meta.from),
      to: this.addresses(payload.meta.to),
      subject: payload.meta.subject,
      reply_to: this.address(payload.meta.replyTo),
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          template_id: templateId,
          personalization: [{ email: this.address(payload.meta.to[0]).email, data: payload.data }],
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(output, {
          text: body.text,
          html: body.html,
        });
        break;
    }

    if (typeof payload.meta.cc !== 'undefined') {
      Object.assign(output, { cc: this.addresses(payload.meta.cc) });
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      Object.assign(output, { bcc: this.addresses(payload.meta.bcc) });
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(output, {
        attachments: payload.meta.attachments.map((attachment: IAttachment) => ({
          content: attachment.content,
          filename: attachment.filename,
        })),
      });
    }

    return output;
  }

  address(recipient: string | IAddressable): IAddressB {
    if (typeof recipient === 'string') {
      return { email: recipient };
    }
    return recipient as IAddressB;
  }

  addresses(recipients: Array<string | IAddressable>): Array<IAddressB> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async dispatch(body: Record<string, unknown>): Promise<SendingResponse> {
    const result = await this.httpClient.post('email', body);
    return this.response(result);
  }

  response(result: HttpResult): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.mailersend)
      .set('server', result.headers.server ?? null)
      .set('uri', null)
      .set('headers', JSON.stringify(result.headers))
      .set('timestamp', Date.now())
      .set('messageId', result.headers['x-message-id'] ?? null)
      .set('body', null)
      .set('statusCode', 202)
      .set('statusMessage', null);
  }

  error(error: IMailersendError): SendingError {
    return new SendingError(error.statusCode, error.body.message, [error.body.errors]);
  }
}
