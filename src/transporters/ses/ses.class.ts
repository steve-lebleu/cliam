import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import type { HttpClient } from '@services/http.service';

import { HttpTransporter } from '@transporters/http.transporter';

import { Debug } from '@decorators/debug.decorator';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { ITransporterConfiguration } from '@transporters/ITransporterConfiguration.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import { signRequest } from './aws4.util';
import type { ISesError } from './ISesError.interface';
import type { ISesResponse } from './ISesResponse.interface';

/**
 * Amazon SES transporter — sends via the SES v2 SendEmail API.
 *
 * @see https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html
 */
export class SesTransporter extends HttpTransporter {
  private readonly region: string;

  constructor(httpClient: HttpClient, configuration: ITransporterConfiguration, region: string) {
    super(httpClient, configuration);
    this.region = region;
  }

  @Debug('ses')
  build({ ...args }: IMail): Record<string, unknown> {
    const { payload, templateId, body, renderEngine } = args;

    const output: Record<string, unknown> = {
      FromEmailAddress: this.address(payload.meta.from),
      ReplyToAddresses: [this.address(payload.meta.replyTo)],
      Destination: {
        ToAddresses: this.addresses(payload.meta.to),
      },
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        Object.assign(output, {
          Content: {
            Template: {
              TemplateName: templateId,
              TemplateData: payload.data ? JSON.stringify(payload.data) : undefined,
            },
          },
        });
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self: {
        const simple: Record<string, unknown> = {
          Subject: { Data: payload.meta.subject, Charset: 'UTF-8' },
          Body: {
            Text: body?.text ? { Data: body.text, Charset: 'UTF-8' } : undefined,
            Html: body?.html ? { Data: body.html, Charset: 'UTF-8' } : undefined,
          },
        };

        if (typeof payload.meta.attachments !== 'undefined') {
          simple.Attachments = payload.meta.attachments.map((a: IAttachment) => ({
            FileName: a.filename,
            RawContent: a.content,
            ContentType: a.type,
            ContentDisposition: a.disposition ?? 'attachment',
            ContentTransferEncoding: 'BASE64',
          }));
        }

        Object.assign(output, { Content: { Simple: simple } });
        break;
      }
    }

    if (typeof payload.meta.cc !== 'undefined') {
      (output.Destination as Record<string, unknown>).CcAddresses = this.addresses(payload.meta.cc);
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      (output.Destination as Record<string, unknown>).BccAddresses = this.addresses(payload.meta.bcc);
    }

    return output;
  }

  address(recipient: string | IAddressable): string {
    if (typeof recipient === 'string') return recipient;
    return typeof recipient.name !== 'undefined' ? `${recipient.name} <${recipient.email}>` : recipient.email;
  }

  addresses(recipients: Array<string | IAddressable>): string[] {
    return [...recipients].map((r) => this.address(r));
  }

  async send(body: Record<string, unknown>): Promise<SendingResponse> {
    const bodyString = JSON.stringify(body);
    const authHeaders = signRequest({
      method: 'POST',
      region: this.region,
      path: '/v2/email/outbound-emails',
      body: bodyString,
      accessKeyId: this.configuration.auth.apiKey!,
      secretAccessKey: this.configuration.auth.apiSecret!,
    });
    const result = await this.httpClient.post<ISesResponse>('v2/email/outbound-emails', body, authHeaders);
    return this.response(result.data);
  }

  response(response: ISesResponse): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.ses)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', response?.MessageId ?? null)
      .set('body', response?.MessageId ?? null)
      .set('statusCode', 200)
      .set('statusMessage', null);
  }

  error(error: ISesError): SendingError {
    return new SendingError(500, error.__type ?? 'SesError', [error.message]);
  }
}
