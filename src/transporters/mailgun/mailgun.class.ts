import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import type { HttpSuccess } from '@services/http.service';

import { Debug } from '@utils/debug.util';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IMailgunError } from './IMailgunError.interface';
import type { IMailgunResponse } from './IMailgunResponse.interface';

/**
 * Mailgun transporter — sends via the Mailgun Messages API.
 *
 * @see https://documentation.mailgun.com/docs/mailgun/api-reference/openapi-final/tag/Messages/
 */
export class MailgunTransporter extends HttpTransporter {
  @Debug('mailgun')
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    const output: Record<string, unknown> = {
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
          type: attachment.type,
        })),
      });
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
    const { attachments, ...fields } = body;
    const form = new FormData();

    for (const [key, value] of Object.entries(fields)) {
      if (Array.isArray(value)) {
        for (const v of value) form.append(key, v as string);
      } else if (value != null) {
        form.append(key, value as string);
      }
    }

    if (Array.isArray(attachments)) {
      for (const att of attachments as Array<{ content: string; filename: string; type?: string }>) {
        const bytes = Uint8Array.from(atob(att.content), c => c.charCodeAt(0));
        form.append('attachment', new Blob([bytes], { type: att.type ?? 'application/octet-stream' }), att.filename);
      }
    }

    const result = await this.httpClient.postFormData<IMailgunResponse, IMailgunError>('messages', form);

    if (!result.ok) {
      return Promise.reject(this.error(result.data));
    }

    return this.response(result);
  }

  response(result: HttpSuccess<IMailgunResponse>): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.mailgun)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', result.data.id)
      .set('body', null)
      .set('statusCode', result.status)
      .set('statusMessage', result.data.message);
  }

  error(error: IMailgunError | string): SendingError {
    const message = typeof error === 'string' ? error : error.message;
    return new SendingError(500, message, [message]);
  }
}
