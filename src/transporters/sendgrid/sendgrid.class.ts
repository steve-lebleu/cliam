import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import type { HttpSuccess } from '@services/http.service';

import { HttpTransporter } from '@transporters/http.transporter';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import { Debug } from '@utils/debug.util';

import type { IMail } from '@interfaces/IMail.interface';
import type { IAddress } from '@interfaces/IAddress.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { ISendgridError } from './ISendgridError.interface';

/**
 * SendGrid transporter — sends via the SendGrid Mail Send API v3.
 *
 * @see https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */
export class SendgridTransporter extends HttpTransporter {
  @Debug('sendgrid')
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    const output: Record<string, unknown> = {
      from: this.address(payload.meta.from, 'from'),
      personalizations: [{ to: this.addresses(payload.meta.to) }],
      reply_to: this.address(payload.meta.replyTo),
      subject: payload.meta.subject,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          dynamic_template_data: payload.data,
          template_id: templateId,
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(output, {
          content: [
            { type: 'text/plain', value: body?.text },
            { type: 'text/html', value: body?.html },
          ],
        });
        break;
    }

    if (typeof payload.meta.cc !== 'undefined') {
      Object.assign((output.personalizations as Array<Record<string, unknown>>)[0], { cc: this.addresses(payload.meta.cc) });
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      Object.assign((output.personalizations as Array<Record<string, unknown>>)[0], { bcc: this.addresses(payload.meta.bcc) });
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(output, { attachments: payload.meta.attachments });
    }

    return output;
  }

  address(recipient: string | IAddressable, type?: string): string | IAddress {
    if (typeof recipient === 'string') {
      return type === 'from' ? recipient : { email: recipient };
    }
    return type === 'from' ? recipient.email : { email: recipient.email, name: recipient.name };
  }

  addresses(recipients: Array<string | IAddressable>): Array<string | IAddress> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const result = await this.httpClient.post<Record<string, unknown>, null, ISendgridError>('v3/mail/send', body);

    if (!result.ok) {
      return Promise.reject(this.error(result.data));
    }

    return this.response(result);
  }

  response(result: HttpSuccess<null>): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.sendgrid)
      .set('server', result.headers.server ?? null)
      .set('uri', null)
      .set('headers', JSON.stringify(result.headers))
      .set('timestamp', Date.now())
      .set('messageId', result.headers['x-message-id'] ?? null)
      .set('body', null)
      .set('statusCode', result.status)
      .set('statusMessage', null);
  }

  error(error: ISendgridError): SendingError {
    const first = error.errors?.[0];
    return new SendingError(400, first?.message ?? 'Unknown error', error.errors.map(e => e.message));
  }
}
