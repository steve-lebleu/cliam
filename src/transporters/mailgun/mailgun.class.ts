import type { IAttachment } from './../../types/interfaces/IAttachment.interface';
import type { IMail } from './../../types/interfaces/IMail.interface';
import type { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import type { IMailgunError } from './IMailgunError.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { Debug } from '../../types/decorators/debug.decorator';

import { PROVIDER } from '@enums/provider.enum';
import { RENDER_ENGINE } from '@enums/render-engine.enum';

import { HttpTransporter } from './../http.transporter';

/**
 * Mailgun transporter — sends via the Mailgun Messages API.
 *
 * @see https://documentation.mailgun.com/docs/mailgun/api-reference/openapi-final/tag/Messages/
 */
export class MailgunTransporter extends HttpTransporter {
  @Debug('mailgun')
  build({ ...args }: IMail): Record<string, string | string[]> {
    const { payload, templateId, body, renderEngine } = args;

    const output: Record<string, string | string[]> = {
      from: this.address(payload.meta.from),
      to: this.addresses(payload.meta.to),
      'h:Reply-To': this.address(payload.meta.replyTo),
      subject: payload.meta.subject,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          'h:X-Mailgun-Variables': JSON.stringify(payload.data),
          template: templateId,
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

    return output;
  }

  address(recipient: string | IAddressable): string {
    if (typeof recipient === 'string') {
      return recipient;
    }
    return typeof recipient.name !== 'undefined' ? `${recipient.name} <${recipient.email}>` : recipient.email;
  }

  addresses(recipients: Array<string | IAddressable>): Array<string> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const result = await this.httpClient.postForm<{ id: string; message: string }>('messages', body as Record<string, string | string[]>);
    return this.response(result.data);
  }

  response(response: Record<string, unknown>): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.mailgun)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', null)
      .set('body', response)
      .set('statusCode', 202)
      .set('statusMessage', response.message as string);
  }

  error(error: IMailgunError): SendingError {
    return new SendingError(error.status, error.type, [error.details]);
  }
}
