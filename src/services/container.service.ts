import { ClientConfiguration } from '@core/client-configuration.class';

import type { Transporter } from '@transporters/transporter.class';
import { TransporterFactory } from '@transporters/transporter.factory';

import type { IClientConfiguration } from '@interfaces/IClientConfiguration.interface';

import { configurationSchema } from '@validations/configuration.validation';

let _configuration: ClientConfiguration | null = null;
let _transporters: { [id: string]: Transporter<any> } | null = null;

/**
 * @description The Container acts as initiator and configuration provider through a module pattern.
 *
 * - Manage initialisation of the configuration, validation included
 * - Act next like a Singleton (module pattern) to be a configuration provider
 */
export const Container = {
  get configuration(): ClientConfiguration {
    if (!_configuration) {
      throw new Error('Cliam is not configured. Call Cliam.configure() or Cliam.configureFromFile() first.');
    }

    return _configuration;
  },

  get transporters(): { [id: string]: Transporter<any> } {
    if (!_transporters) {
      throw new Error('Cliam is not configured. Call Cliam.configure() or Cliam.configureFromFile() first.');
    }

    return _transporters;
  },

  configure(raw: IClientConfiguration): void {
    const { error, value } = configurationSchema.validate(raw, { abortEarly: true, allowUnknown: false });

    if (error) {
      throw new Error(`Invalid Cliam configuration: ${error.details[0].message}`);
    }

    _configuration = new ClientConfiguration(value);

    const { transporters, defaults } = _configuration;

    _transporters = transporters
      .reduce((result: { [id: string]: Transporter<any> }, transporterDefinition) => {
        result[transporterDefinition.id] = TransporterFactory.get(defaults, transporterDefinition);
        return result;
      }, {});
  }
};
