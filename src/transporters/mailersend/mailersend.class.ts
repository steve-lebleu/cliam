import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddress } from '@interfaces/IAddress.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { HttpSuccess } from '@services/http.service';

import { Debug } from '@utils/debug.util';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IMailersendError } from './IMailersendError.interface';
import type { IMailersendResponse } from './IMailersendResponse.interface';

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
          text: body?.text,
          html: body?.html,
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

  address(recipient: string | IAddressable): IAddress {
    if (typeof recipient === 'string') {
      return { email: recipient };
    }
    return recipient as IAddress;
  }

  addresses(recipients: Array<string | IAddressable>): Array<IAddress> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const result = await this.httpClient.post<Record<string, unknown>, IMailersendResponse, IMailersendError>('email', body);

    if (!result.ok) {
      return Promise.reject(this.error(result.data));
    }

    return this.response(result);
  }

  response(result: HttpSuccess<IMailersendResponse>): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.mailersend)
      .set('server', result.headers.server ?? null)
      .set('uri', null)
      .set('headers', JSON.stringify(result.headers))
      .set('timestamp', Date.now())
      .set('messageId', result.headers['x-message-id'] ?? null)
      .set('body', null)
      .set('statusCode', result.status)
      .set('statusMessage', null);
  }

  error(error: IMailersendError): SendingError {
    return new SendingError(error.statusCode, error.body.message, [error.body.errors]);
  }
}
