import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import type { HttpFailure, HttpSuccess } from '@services/http.service';

import { Debug } from '@utils/debug.util';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { ISparkpostAddress } from './ISparkpostAddress.interface';
import type { ISparkpostBody } from './ISparkpostBody.interface';
import type { ISparkpostError } from './ISparkpostError.interface';
import type { ISparkpostResponse } from './ISparkpostResponse.interface';

/**
 * SparkPost transporter — sends via the SparkPost Transmissions API.
 *
 * @see https://developers.sparkpost.com/api/transmissions/
 */
export class SparkpostTransporter extends HttpTransporter<ISparkpostBody> {
  @Debug('sparkpost')
  build({ ...args }: IMail): ISparkpostBody {
    const { payload, templateId, body, renderEngine } = args;

    let cc: ISparkpostAddress[] = [];
    let bcc: ISparkpostAddress[] = [];

    const output: ISparkpostBody = {
      recipients: this.addresses(payload.meta.to),
      content: {
        from: payload.meta.from,
        subject: payload.meta.subject,
        reply_to: `${(payload.meta.replyTo as IAddressable).name} <${(payload.meta.replyTo as IAddressable).email}>`,
      },
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, { substitution_data: payload.data });
        Object.assign(output.content as Record<string, unknown>, {
          template_id: templateId,
          use_draft_template: false,
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self:
        Object.assign(output.content as Record<string, unknown>, {
          text: body?.text,
          html: body?.html,
        });
        break;
    }

    if (typeof payload.meta.cc !== 'undefined') {
      cc = payload.meta.cc.map((recipient: string | IAddressable) => {
        const addr = this.address(recipient);
        const primary = payload.meta.to[0];
        Object.assign(addr, { header_to: typeof primary === 'string' ? primary : (primary as IAddressable).email });
        return addr;
      });
      output.recipients = [...output.recipients, ...cc];
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      bcc = payload.meta.bcc.map((recipient: string | IAddressable) => {
        const addr = this.address(recipient);
        const primary = payload.meta.to[0];
        Object.assign(addr, { header_to: typeof primary === 'string' ? primary : (primary as IAddressable).email });
        return addr;
      });
      output.recipients = [...output.recipients, ...bcc];
    }

    if (cc.length > 0 && bcc.length > 0) {
      Object.assign(output.content, {
        headers: { CC: cc.map((r: ISparkpostAddress) => r.address) },
      });
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(output.content, {
        attachments: payload.meta.attachments.map((attachment: IAttachment) => ({
          name: attachment.filename,
          type: attachment.type,
          data: attachment.content,
        })),
      });
    }

    return output;
  }

  address(recipient: string | IAddressable): ISparkpostAddress {
    return { address: recipient };
  }

  addresses(recipients: Array<string | IAddressable>): ISparkpostAddress[] {
    return [...recipients].map((recipient: string | IAddressable) => this.address(recipient));
  }

  async send(body: ISparkpostBody): Promise<SendingResponse> {
    const result = await this.httpClient.post<ISparkpostBody, ISparkpostResponse, ISparkpostError>('v1/transmissions', body);

    if (!result.ok) {
      return Promise.reject(this.error(result));
    }

    return this.response(result);
  }

  response(result: HttpSuccess<ISparkpostResponse>): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.sparkpost)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', result.data.results.id)
      .set('body', { accepted: result.data.results.total_accepted_recipients, rejected: result.data.results.total_rejected_recipients })
      .set('statusCode', result.status)
      .set('statusMessage', null);
  }

  error(result: HttpFailure<ISparkpostError>): SendingError {
    return new SendingError(result.data.statusCode, result.data.errors[0].message, [result.data.errors[0]?.description ?? '']);
  }
}
