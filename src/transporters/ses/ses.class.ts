import { SendingError } from '@core/sending-error.class';
import { SendingResponse } from '@core/sending-response.class';

import type { HttpClient, HttpFailure, HttpSuccess } from '@services/http.service';

import { HttpTransporter } from '@transporters/http.transporter';

import { Debug } from '@utils/debug.util';

import { PROVIDER } from '@typings/provider.type';
import { RENDER_ENGINE } from '@typings/render-engine.type';

import type { IAttachment } from '@interfaces/IAttachment.interface';
import type { ITransporterConfiguration } from '@transporters/ITransporterConfiguration.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IAddressable } from '@interfaces/IAddressable.interface';

import { signRequest } from './aws4.util';
import type { ISesBody } from './ISesBody.interface';
import type { ISesError } from './ISesError.interface';
import type { ISesResponse } from './ISesResponse.interface';

/**
 * Amazon SES transporter — sends via the SES v2 SendEmail API.
 *
 * @see https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html
 */
export class SesTransporter extends HttpTransporter<ISesBody> {
  private readonly region: string;

  constructor(httpClient: HttpClient, configuration: ITransporterConfiguration, region: string) {
    super(httpClient, configuration);
    this.region = region;
  }

  @Debug('ses')
  build({ ...args }: IMail): ISesBody {
    const { payload, templateId, body, renderEngine } = args;

    const output: ISesBody = {
      FromEmailAddress: this.address(payload.meta.from),
      ReplyToAddresses: [this.address(payload.meta.replyTo)],
      Destination: {
        ToAddresses: this.addresses(payload.meta.to),
      },
      Content: {},
    };

    switch (renderEngine.valueOf()) {
      case RENDER_ENGINE.provider:
        output.Content = {
          Template: {
            TemplateName: templateId!,
            TemplateData: payload.data ? JSON.stringify(payload.data) : undefined,
          },
        };
        break;
      case RENDER_ENGINE.cliam:
      case RENDER_ENGINE.self: {
        output.Content = {
          Simple: {
            Subject: { Data: payload.meta.subject, Charset: 'UTF-8' },
            Body: {
              Text: body?.text ? { Data: body.text, Charset: 'UTF-8' } : undefined,
              Html: body?.html ? { Data: body.html, Charset: 'UTF-8' } : undefined,
            },
            Attachments: payload.meta.attachments?.map((a: IAttachment) => ({
              FileName: a.filename,
              RawContent: a.content,
              ContentType: a.type,
              ContentDisposition: a.disposition ?? 'attachment',
              ContentTransferEncoding: 'BASE64' as const,
            })),
          },
        };
        break;
      }
    }

    if (typeof payload.meta.cc !== 'undefined') {
      output.Destination.CcAddresses = this.addresses(payload.meta.cc);
    }

    if (typeof payload.meta.bcc !== 'undefined') {
      output.Destination.BccAddresses = this.addresses(payload.meta.bcc);
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

  async send(body: ISesBody): Promise<SendingResponse> {
    const bodyString = JSON.stringify(body);
    const authHeaders = signRequest({
      method: 'POST',
      region: this.region,
      path: '/v2/email/outbound-emails',
      body: bodyString,
      accessKeyId: this.configuration.auth.apiKey!,
      secretAccessKey: this.configuration.auth.apiSecret!,
    });

    const result = await this.httpClient.post<ISesBody, ISesResponse, ISesError>('v2/email/outbound-emails', body, authHeaders);

    if (!result.ok) {
      return Promise.reject(this.error(result));
    }

    return this.response(result);
  }

  response(result: HttpSuccess<ISesResponse>): SendingResponse {
    return new SendingResponse()
      .set('provider', PROVIDER.ses)
      .set('server', null)
      .set('uri', null)
      .set('headers', null)
      .set('timestamp', Date.now())
      .set('messageId', result.data.MessageId)
      .set('body', null)
      .set('statusCode', result.status)
      .set('statusMessage', null);
  }

  error(result: HttpFailure<ISesError>): SendingError {
    return new SendingError(result.status, result.data.__type ?? 'SesError', [result.data.message]);
  }
}
