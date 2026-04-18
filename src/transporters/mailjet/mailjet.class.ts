import type { IAttachment } from './../../types/interfaces/IAttachment.interface';
import type { IMail } from './../../types/interfaces/IMail.interface';
import type { IAddressA } from './../../types/interfaces/addresses/IAddressA.interface';
import type { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import type { IMailjetError } from './IMailjetError.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { Debug } from './../../types/decorators/debug.decorator';

import { PROVIDER } from '@enums/provider.enum';
import { RENDER_ENGINE } from '@enums/render-engine.enum';

import { HttpTransporter } from './../http.transporter';

/**
 * Mailjet transporter — sends via the Mailjet Send API v3.1.
 *
 * @see https://dev.mailjet.com/email/guides/
 */
export class MailjetTransporter extends HttpTransporter {
  @Debug('mailjet')
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    const message: Record<string, unknown> = {
      From: this.address(payload.meta.from),
      To: this.addresses(payload.meta.to),
      ReplyTo: this.address(payload.meta.replyTo),
      Subject: payload.meta.subject,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(message, {
          Variables: payload.data,
          TemplateLanguage: true,
          TemplateID: Number.parseInt(templateId, 10),
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(message, {
          TextPart: body.text,
          HTMLPart: body.html,
        });
        break;
    }

    if (typeof payload.meta.cc !== 'undefined') {
      Object.assign(message, { Cc: this.addresses(payload.meta.cc) });
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      Object.assign(message, { Bcc: this.addresses(payload.meta.bcc) });
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(message, {
        Attachments: payload.meta.attachments.map((attachment: IAttachment) => ({
          ContentType: attachment.type,
          Filename: attachment.filename,
          Base64Content: attachment.content,
        })),
      });
    }

    return { Messages: [message] };
  }

  address(recipient: string | IAddressable): IAddressA {
    if (typeof recipient === 'string') {
      return { Email: recipient };
    }
    return typeof recipient.name !== 'undefined' ? { Email: recipient.email, Name: recipient.name } : { Email: recipient.email };
  }

  addresses(recipients: Array<string | IAddressable>): IAddressA[] {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const result = await this.httpClient.post<{ Messages: Array<{ Status: string }> }>('v3.1/send', body);
    return this.response(result.data);
  }

  response(response: { Messages: Array<{ Status: string }> }): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.mailjet)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', null)
      .set('body', null)
      .set('statusCode', 202)
      .set('statusMessage', response.Messages?.[0]?.Status ?? null);
  }

  error(error: IMailjetError): SendingError {
    return new SendingError(error.statusCode, error.ErrorMessage, [error.ErrorMessage]);
  }
}
