import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import { Debug } from '@decorators/debug.decorator';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { IResendError } from './IResendError.interface';
import type { IResendResponse } from './IResendResponse.interface';

/**
 * Resend transporter — sends via the Resend API.
 *
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export class ResendTransporter extends HttpTransporter {
  @Debug('resend')
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
          record: payload.data,
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(output, {
          html: body?.html,
          text: body?.text,
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
          filename: attachment.filename,
          content: attachment.content,
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
    const result = await this.httpClient.post<IResendResponse>('emails', body);
    return this.response(result.data);
  }

  response(response: IResendResponse): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.resend)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response.id)
      .set('body', response.id)
      .set('statusCode', 202)
      .set('statusMessage', null);
  }

  error(error: IResendError): SendingError {
    return new SendingError(error.statusCode ?? 500, error.name, [error.message]);
  }
}
