import type { IAttachment } from './../../types/interfaces/IAttachment.interface';
import type { IMail } from './../../types/interfaces/IMail.interface';
import type { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import type { IPostmarkError } from './IPostmarkError.interface';
import type { IPostmarkResponse } from './IPostmarkResponse.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { PROVIDER } from '@enums/provider.enum';
import { RENDER_ENGINE } from '@enums/render-engine.enum';

import { Debug } from './../../types/decorators/debug.decorator';
import { HttpTransporter } from './../http.transporter';

/**
 * Postmark transporter — sends via the Postmark Email API.
 *
 * @see https://postmarkapp.com/developer/api/email-api
 */
export class PostmarkTransporter extends HttpTransporter {
  @Debug('postmark')
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    const output: Record<string, unknown> = {
      From: this.address(payload.meta.from),
      To: this.addresses(payload.meta.to),
      ReplyTo: this.address(payload.meta.replyTo),
      Subject: payload.meta.subject,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          TemplateModel: payload.data,
          TemplateId: Number.parseInt(templateId, 10),
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(output, {
          TextBody: body.text,
          HtmlBody: body.html,
        });
        break;
    }

    if (typeof payload.meta.cc !== 'undefined') {
      Object.assign(output, { Cc: this.addresses(payload.meta.cc) });
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      Object.assign(output, { Bcc: this.addresses(payload.meta.bcc) });
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(output, {
        Attachments: payload.meta.attachments.map((attachment: IAttachment) => ({
          ContentTransferEncoding: 'base64',
          Content: attachment.content,
          Name: attachment.filename,
          Cid: `cid:${attachment.filename}`,
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

  addresses(recipients: Array<string | IAddressable>): string {
    return [...recipients].map((r: string | IAddressable) => this.address(r)).join(',');
  }

  async dispatch(body: Record<string, unknown>): Promise<SendingResponse> {
    const endpoint = 'TemplateId' in body ? 'email/withTemplate' : 'email';
    const result = await this.httpClient.post<IPostmarkResponse>(endpoint, body);
    return this.response(result.data);
  }

  response(response: IPostmarkResponse): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.postmark)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response.MessageID)
      .set('body', response.Message)
      .set('statusCode', 202)
      .set('statusMessage', null);
  }

  error(error: IPostmarkError): SendingError {
    return new SendingError(
      (error as any).statusCode || (error as any).code,
      (error as any).name || (error as any).message,
      (error as any).response?.body?.errors ?? [(error as any).message],
    );
  }
}
