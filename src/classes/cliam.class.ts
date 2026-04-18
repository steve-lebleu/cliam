import { existsSync } from 'node:fs';

import { Container } from './../services/container.service';
import { IClientConfiguration } from './client-configuration.class';
import { Event } from './../types/types/event.type';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { SendingResponse } from './sending-response.class';
import { SendingError } from './sending-error.class';
import { Mailer } from './../services/mailer.service';

export class Cliam {
  private static mailers: { [id: string]: Mailer } = {};

  private constructor() {}

  /**
   * @description Configure Cliam from a plain configuration object.
   */
  static configure(config: IClientConfiguration): void {
    Container.configure(config);
    Cliam.mailers = {};

    Object.keys(Container.transporters).forEach(key => {
      Cliam.mailers[key] = new Mailer(Container.transporters[key]);
    });
  }

  /**
   * @description Configure Cliam by loading a .js configuration file.
   * Defaults to .cliamrc.js at process.cwd() when no path is provided.
   */
  static configureFromFile(path?: string): void {
    const filePath = path ?? `${process.cwd()}/.cliamrc.js`;

    if (!existsSync(filePath)) {
      throw new Error(`Cliam configuration file not found: ${filePath}`);
    }

    delete require.cache[require.resolve(filePath)];

    const config = require(filePath);
    Cliam.configure(config);
  }

  /**
   * @description Send an email.
   */
  static async mail(event: Event | string, payload: IPayload): Promise<SendingResponse | SendingError> {
    if (Object.keys(Cliam.mailers).length === 0) {
      throw new Error('Cliam is not configured. Call Cliam.configure() or Cliam.configureFromFile() first.');
    }

    const key = payload.transporterId || Object.keys(Container.transporters).shift();

    if (!Cliam.mailers[key]) {
      throw new Error(`transporterId "${key}" not found in configuration`);
    }

    return Cliam.mailers[key].send(event, payload);
  }
}
