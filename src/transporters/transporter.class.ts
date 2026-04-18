import type { SendingError } from './../classes/sending-error.class';
import type { SendingResponse } from './../classes/sending-response.class';
import type { IMail } from './../types/interfaces/IMail.interface';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import type { ITransporterMailer } from './ITransporterMailer.interface';

/**
 * Main Transporter class
 */
export abstract class Transporter {
  /**
   * @description Initial transporter configuration options defined in cliamrc
   */
  public configuration: ITransporterConfiguration = null;

  /**
   * @description Wrapped concrete transporter instance
   */
  public transporter: ITransporterMailer | null = null;

  constructor(transporterEngine: ITransporterMailer, configuration: ITransporterConfiguration) {
    this.transporter = transporterEngine;
    this.configuration = configuration;
  }

  /**
   * @description
   *
   * @param err
   */
  public error(err): any {}

  /**
   * @description
   *
   * @param err
   */
  public response(res): any {}

  /**
   * @description
   *
   * @param err
   */
  public build({..._args }: IMail): any {}

  abstract send(body: Record<string, unknown>): Promise<SendingResponse | SendingError>;
}
