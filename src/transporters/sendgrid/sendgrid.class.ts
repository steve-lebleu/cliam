import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import type { HttpFailure, HttpSuccess } from '@services/http.service';

import { HttpTransporter } from '@transporters/http.transporter';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import { Debug } from '@utils/debug.util';

import type { IMail } from '@interfaces/IMail.interface';
import type { IAddress } from '@interfaces/IAddress.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { ISendgridBody } from './ISendgridBody.interface';
import type { ISendgridError } from './ISendgridError.interface';

/**
 * SendGrid transporter — sends via the SendGrid Mail Send API v3.
 *
 * @see https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */
export class SendgridTransporter extends HttpTransporter<ISendgridBody> {
  @Debug('sendgrid')
  build({ ...args }: IMail): ISendgridBody {
    const { payload, templateId, body, renderEngine } = args;

    const output: ISendgridBody = {
      from: this.address(payload.meta.from),
      personalizations: [{ to: this.addresses(payload.meta.to) }],
      reply_to: this.address(payload.meta.replyTo),
      subject: payload.meta.subject,
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          substitutions: payload.data,
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
      output.personalizations[0].cc = this.addresses(payload.meta.cc) as IAddress[];
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      output.personalizations[0].bcc = this.addresses(payload.meta.bcc) as IAddress[];
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(output, { attachments: payload.meta.attachments });
    }

    return output;
  }

  address(recipient: string | IAddressable): IAddress {
    if (typeof recipient === 'string') {
      return { email: recipient };
    }

    return { email: recipient.email, name: recipient?.name };
  }

  addresses(recipients: Array<string | IAddressable>): Array<IAddress> {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: ISendgridBody): Promise<SendingResponse> {
    const result = await this.httpClient.post<ISendgridBody, null, ISendgridError>('v3/mail/send', body);

    if (!result.ok) {
      throw this.error(result);
    }

    return this.response(result);
  }

  response(result: HttpSuccess<null>): SendingResponse {
    const { status, headers } = result;

    return new SendingResponse()
      .set('provider', PROVIDER.sendgrid)
      .set('server', headers.server ?? null)
      .set('uri', null)
      .set('headers', headers)
      .set('timestamp', Date.now())
      .set('messageId', headers['x-message-id'] ?? null)
      .set('body', null)
      .set('statusCode', status)
      .set('statusMessage', null);
  }

  error(error: HttpFailure<ISendgridError>): SendingError {
    const { status, data: { errors } } = error;

    return new SendingError(status, status === 400 ? 'Bad request' : 'Unknown error', errors.map(e => `${e.field}: ${e.message}`));
  }
}
