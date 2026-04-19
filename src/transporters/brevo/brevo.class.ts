import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import { Debug } from '@utils/debug.util';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddress } from '@interfaces/IAddress.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { IBrevoError } from './IBrevoError.interface';
import type { IBrevoResponse } from './IBrevoResponse.interface';

/**
 * Brevo transporter — sends via the Brevo SMTP API (https://api.brevo.com/v3/smtp/email).
 *
 * @see https://app.brevo.com/
 * @see https://developers.brevo.com/reference/sendtransacemail
 */
export class BrevoTransporter extends HttpTransporter {
  @Debug('brevo')
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    const output: Record<string, unknown> = {
      to: this.addresses(payload.meta.to),
      sender: this.address(payload.meta.from),
      replyTo: this.address(payload.meta.replyTo),
      subject: payload.meta.subject,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          params: payload.data,
          templateId: Number.parseInt(templateId!, 10),
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(output, {
          textContent: body?.text,
          htmlContent: body?.html,
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
        attachment: payload.meta.attachments.map((attachment: IAttachment) => ({
          content: attachment.content,
          name: attachment.filename,
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
    const result = await this.httpClient.post('smtp/email', body);

    if (result.status >= 400) {
      return Promise.reject(this.error(result.data as IBrevoError));
    }

    return this.response(result.data as IBrevoResponse);
  }

  response(response: IBrevoResponse): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.brevo)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response.messageId)
      .set('body', response.messageId)
      .set('statusCode', 202)
      .set('statusMessage', null);
  }

  error(error: IBrevoError): SendingError {
    const match = /[0-9]+/.exec(error.message);
    return new SendingError(match ? Number.parseInt(match[0], 10) : 500, error.name, [error.message]);
  }
}
