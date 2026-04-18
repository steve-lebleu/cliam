import type { SendingError } from './../classes/sending-error.class';
import type { SendingResponse } from './../classes/sending-response.class';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import type { HttpClient } from '@services/http.service';
import { Transporter } from './transporter.class';

export abstract class HttpTransporter extends Transporter {
  public readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, configuration: ITransporterConfiguration) {
    super(null, configuration);
    this.httpClient = httpClient;
  }

  abstract dispatch(body: Record<string, unknown>): Promise<SendingResponse | SendingError>;

  async send(body: Record<string, unknown>): Promise<SendingResponse | SendingError> {
    return this.dispatch(body);
  }
}
