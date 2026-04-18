import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const _require = createRequire(import.meta.url);

import type { SendingError } from '@core/sending-error.class';
import type { SendingResponse } from '@core/sending-response.class';

import { Container } from '@services/container.service';
import { Mailer } from '@services/mailer.service';

import type { IClientConfiguration } from '@interfaces/IClientConfiguration.interface';
import type { IPayload } from '@interfaces/IPayload.interface';
import type { Event } from '@typings/event.type';

/**
 * @summary The core engine of Cliam allowing consumers to:
 *
 * - Configure their Cliam client
 * - Send emails
 */
export class Cliam {
  private static mailers: { [id: string]: Mailer } = {};

  private constructor() {}

  /**
   * @description Configure Cliam from a plain configuration object.
   */
  static configure(config: IClientConfiguration): void {
    Container.configure(config);
    Cliam.mailers = {};

    for (const key of Object.keys(Container.transporters)) {
      Cliam.mailers[key] = new Mailer(Container.transporters[key]);
    }
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

    delete _require.cache[_require.resolve(filePath)];

    const config = _require(filePath);
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
