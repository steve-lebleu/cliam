import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import type { HttpSuccess } from '@services/http.service';

import { Debug } from '@utils/debug.util';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddress } from '@interfaces/IAddress.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { IMandrillBody } from './IMandrillBody.interface';
import type { IMandrillError } from './IMandrillError.interface';
import type { IMandrillResponse } from './IMandrillResponse.interface';

/**
 * Mandrill transporter — sends via the Mandrill Transactional API.
 *
 * @see https://mailchimp.com/developer/transactional/api/messages/
 */
export class MandrillTransporter extends HttpTransporter<IMandrillBody> {
  @Debug('mandrill')
  build({ ...args }: IMail): IMandrillBody {
    const { payload, templateId, body, renderEngine } = args;

    const message: Record<string, unknown> = {
      subject: payload.meta.subject,
      from_email: this.address(payload.meta.from, 'string'),
      from_name: (payload.meta.from as IAddressable).name,
      to: this.addresses(payload.meta.to, 'to'),
      headers: { 'Reply-To': this.address(payload.meta.replyTo.email, 'string') },
      track_opens: true,
      track_click: true,
      preserve_recipients: true,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        return {
          template_name: templateId,
          template_content: [payload.data],
          message,
        } as unknown as IMandrillBody;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(message, { text: body?.text, html: body?.html });
        break;
    }

    if (typeof payload.meta.cc !== 'undefined') {
      (message.to as Array<unknown>) = [...(message.to as Array<unknown>), ...this.addresses(payload.meta.cc, 'cc')];
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      (message.to as Array<unknown>) = [...(message.to as Array<unknown>), ...this.addresses(payload.meta.bcc, 'bcc')];
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(message, {
        attachments: payload.meta.attachments.map((attachment: IAttachment) => ({
          type: attachment.type,
          name: attachment.filename,
          content: attachment.content,
        })),
      });
    }

    return { message } as unknown as IMandrillBody;
  }

  address(recipient: string | IAddressable, type?: string): string | IAddress {
    if (typeof recipient === 'string') {
      return recipient;
    }
    if (type === 'string') {
      return recipient.email;
    }
    return typeof recipient.email !== 'undefined' ? recipient.email : (recipient as unknown as string);
  }

  addresses(recipients: Array<string | IAddressable>, type?: string): Array<string | IAddress> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient, type));
  }

  async send(body: IMandrillBody): Promise<SendingResponse> {
    const isTemplate = 'template_name' in body;
    const endpoint = isTemplate ? 'messages/send-template' : 'messages/send';

    const result = await this.httpClient.post<Record<string, unknown>, IMandrillResponse[], IMandrillError>(endpoint, {
      key: this.configuration.auth.apiKey,
      ...body,
    });

    if (!result.ok) {
      throw this.error(result.data);
    }

    const rejected = result.data.find(r => r.status === 'rejected' || r.status === 'invalid');

    if (rejected) {
      throw this.error({ status: 'error', code: 400, name: rejected.status, message: `${rejected.reject_reason} (email: ${rejected.email})` });
    }

    return this.response(result);
  }

  response(result: HttpSuccess<IMandrillResponse[]>): SendingResponse {
    const { headers, status, data } = result;

    return new SendingResponse()
      .set('provider', PROVIDER.mandrill)
      .set('server', null)
      .set('uri', null)
      .set('headers', headers)
      .set('timestamp', Date.now())
      .set('messageId', data[0]?._id ?? null)
      .set('body', data[0]?.status ?? null)
      .set('statusCode', status)
      .set('statusMessage', null);
  }

  error(error: IMandrillError): SendingError {
    const { code, name, message } = error;

    return new SendingError(code, name, [message]);
  }
}
