import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import { HttpTransporter } from '@transporters/http.transporter';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import type { ISparkpostAddress } from './ISparkpostAddress.interface';
import type { ISparkpostError } from './ISparkpostError.interface';
import type { ISparkpostResponse } from './ISparkpostResponse.interface';

/**
 * SparkPost transporter — sends via the SparkPost Transmissions API.
 *
 * @see https://developers.sparkpost.com/api/transmissions/
 */
export class SparkpostTransporter extends HttpTransporter {
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    let cc: ISparkpostAddress[] = [];
    let bcc: ISparkpostAddress[] = [];

    const output: Record<string, unknown> = {
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
      (output.recipients as ISparkpostAddress[]) = [...(output.recipients as ISparkpostAddress[]), ...cc];
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      bcc = payload.meta.bcc.map((recipient: string | IAddressable) => {
        const addr = this.address(recipient);
        const primary = payload.meta.to[0];
        Object.assign(addr, { header_to: typeof primary === 'string' ? primary : (primary as IAddressable).email });
        return addr;
      });
      (output.recipients as ISparkpostAddress[]) = [...(output.recipients as ISparkpostAddress[]), ...bcc];
    }

    if (cc.length > 0 && bcc.length > 0) {
      Object.assign(output.content as Record<string, unknown>, {
        headers: { CC: cc.map((r: ISparkpostAddress) => r.address) },
      });
    }

    if (typeof payload.meta.attachments !== 'undefined') {
      Object.assign(output.content as Record<string, unknown>, {
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

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const result = await this.httpClient.post<ISparkpostResponse>('v1/transmissions', body);
    return this.response(result.data);
  }

  response(response: ISparkpostResponse): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.sparkpost)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response.results.id)
      .set('body', null)
      .set('statusCode', 202)
      .set('statusMessage', null);
  }

  error(error: ISparkpostError): SendingError {
    return new SendingError(error.statusCode, error.errors[0].message, [error.errors[0]?.description ?? '']);
  }
}
