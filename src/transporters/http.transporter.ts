import type { HttpClient } from '@services/http.service';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import { Transporter } from './transporter.class';

export abstract class HttpTransporter<TBody> extends Transporter<TBody> {
  public readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, configuration: ITransporterConfiguration) {
    super(configuration);
    this.httpClient = httpClient;
  }
}
