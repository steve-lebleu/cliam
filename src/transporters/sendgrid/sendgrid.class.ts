import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import type { HttpResult } from '@services/http.service';

import { HttpTransporter } from '@transporters/http.transporter';

import { PROVIDER } from '@enums/provider.enum';
import { RENDER_ENGINE } from '@enums/render-engine.enum';

import { Debug } from '@decorators/debug.decorator';

import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressB } from '@interfaces/addresses/IAddressB.interface';
import type { IAddressable } from '@interfaces/addresses/IAddressable.interface';

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
            { type: 'text/plain', value: body.text },
            { type: 'text/html', value: body.html },
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

  address(recipient: string | IAddressable, type?: string): string | IAddressB {
    if (typeof recipient === 'string') {
      return type === 'from' ? recipient : { email: recipient };
    }
    return type === 'from' ? recipient.email : { email: recipient.email, name: recipient.name };
  }

  addresses(recipients: Array<string | IAddressable>): Array<string | IAddressB> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const result = await this.httpClient.post('v3/mail/send', body);
    return this.response(result);
  }

  response(result: HttpResult): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.sendgrid)
      .set('server', result.headers.server ?? null)
      .set('uri', null)
      .set('headers', JSON.stringify(result.headers))
      .set('timestamp', Date.now())
      .set('messageId', result.headers['x-message-id'] ?? null)
      .set('body', null)
      .set('statusCode', 202)
      .set('statusMessage', null);
  }

  error(error: ISendgridError): SendingError {
    return new SendingError(
      (error as any).code || (error as any).statusCode,
      (error as any).name || (error as any).message,
      (error as any).response?.body?.errors ?? [(error as any).message],
    );
  }
}
