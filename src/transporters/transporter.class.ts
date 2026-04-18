import type { SendingError } from '@core/sending-error.class';
import type { SendingResponse } from '@core/sending-response.class';
import type { IMail } from '@interfaces/IMail.interface';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import type { ITransporterMailer } from './ITransporterMailer.interface';

/**
 * @summary Base class for all Transporter classes
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
   * @description Method in charge of parsing the transporter engine error into a SendingError object
   *
   * @param err An error object from the transporter engine
   */
  abstract error(err: unknown): SendingError;

  /**
   * @description Method in charge of parsing the transporter engine response into a SendingResponse object
   *
   * @param res A response object from the transporter engine
   */
  abstract response(res: unknown): SendingResponse;

  /**
   * @description Method in charge to build the transporter engine specific request body
   *
   * @param args IMail interface arguments
   */
  abstract build({ ...args }: IMail): Record<string, unknown>;

  /**
   * @description Method in charge to send the email through the transporter engine
   *
   * @param body The transporter engine specific request body
   */
  abstract send(body: Record<string, unknown>): Promise<SendingResponse | SendingError>;
}
