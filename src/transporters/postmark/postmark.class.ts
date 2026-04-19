import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import type { HttpFailure, HttpSuccess } from '@services/http.service';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import { Debug } from '@utils/debug.util';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { IPostmarkBody } from './IPostmarkBody.interface';
import type { IPostmarkError } from './IPostmarkError.interface';
import type { IPostmarkResponse } from './IPostmarkResponse.interface';

/**
 * Postmark transporter — sends via the Postmark Email API.
 *
 * @see https://postmarkapp.com/developer/api/email-api
 */
export class PostmarkTransporter extends HttpTransporter<IPostmarkBody> {
  @Debug('postmark')
  build({ ...args }: IMail): IPostmarkBody {
    const { payload, templateId, body, renderEngine } = args;

    const output: IPostmarkBody = {
      From: this.address(payload.meta.from),
      To: this.addresses(payload.meta.to).join(','),
      ReplyTo: this.address(payload.meta.replyTo),
      Subject: payload.meta.subject,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          TemplateModel: payload.data,
          TemplateId: Number.parseInt(templateId!, 10),
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(output, {
          TextBody: body?.text,
          HtmlBody: body?.html,
        });
        break;
    }

    if (typeof payload.meta.cc !== 'undefined') {
      Object.assign(output, { Cc: this.addresses(payload.meta.cc).join(',') });
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      Object.assign(output, { Bcc: this.addresses(payload.meta.bcc).join(',') });
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

  addresses(recipients: Array<string | IAddressable>): string[] {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: IPostmarkBody): Promise<SendingResponse> {
    const endpoint = 'TemplateId' in body ? 'email/withTemplate' : 'email';
    const result = await this.httpClient.post<IPostmarkBody, IPostmarkResponse, IPostmarkError>(endpoint, body);

    if (!result.ok) {
      throw this.error(result);
    }

    return this.response(result);
  }

  response(result: HttpSuccess<IPostmarkResponse>): SendingResponse {
    const { MessageID, Message, SubmittedAt } = result.data;

    return new SendingResponse()
      .set('provider', PROVIDER.postmark)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', SubmittedAt)
      .set('messageId', MessageID)
      .set('body', Message)
      .set('statusCode', result.status)
      .set('statusMessage', null);
  }

  error(result: HttpFailure<IPostmarkError>): SendingError {
    const { ErrorCode, Message } = result.data;

    return new SendingError(ErrorCode, Message, [Message]);
  }
}
