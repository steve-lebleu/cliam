import type { IAttachment } from './../../types/interfaces/IAttachment.interface';
import type { IMail } from './../../types/interfaces/IMail.interface';
import type { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import type { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import type { IMandrillError } from './IMandrillError.interface';
import type { IMandrillResponse } from './IMandrillResponse.interface';

import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';

import { PROVIDER } from '@enums/provider.enum';
import { RENDER_ENGINE } from '@enums/render-engine.enum';

import { HttpTransporter } from './../http.transporter';

/**
 * Mandrill transporter — sends via the Mandrill Transactional API.
 *
 * @see https://mailchimp.com/developer/transactional/api/messages/
 */
export class MandrillTransporter extends HttpTransporter {
  build({ ...args }: IMail): Record<string, unknown> {
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
        };
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(message, { text: body.text, html: body.html });
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

    return { message };
  }

  address(recipient: string | IAddressable, type?: string): string | IAddressB {
    if (typeof recipient === 'string') {
      return recipient;
    }
    if (type === 'string') {
      return recipient.email;
    }
    return typeof recipient.email !== 'undefined' ? recipient.email : (recipient as unknown as string);
  }

  addresses(recipients: Array<string | IAddressable>, type?: string): Array<string | IAddressB> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient, type));
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const isTemplate = 'template_name' in body;
    const endpoint = isTemplate ? 'messages/send-template' : 'messages/send';
    const payload = isTemplate ? body : body;
    const result = await this.httpClient.post<IMandrillResponse[]>(endpoint, {
      key: this.configuration.auth.apiKey,
      ...payload,
    });
    return this.response(result.data);
  }

  response(response: IMandrillResponse[]): SendingResponse {
    const rejected = response.filter(r => r.status === 'rejected' || r.status === 'invalid');
    if (rejected.length) {
      throw { statusCode: 400, statusText: rejected[0].status, message: `${rejected[0].reject_reason} (email: ${rejected[0].email})` };
    }
    return new SendingResponse()
      .set('provider', PROVIDER.mandrill)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response[0]._id)
      .set('body', response[0].status)
      .set('statusCode', 202)
      .set('statusMessage', null);
  }

  error(error: IMandrillError): SendingError {
    return new SendingError(error.code, error.name, [error.message]);
  }
}
