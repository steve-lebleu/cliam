import type { IDefaults } from '@interfaces/IDefaults.interface';

import type { Provider } from '@typings/provider.type';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import type { Transporter } from './transporter.class';

export type TransporterCreator = (defaults: IDefaults, cfg: ITransporterConfiguration) => Transporter<any>;

const registry = new Map<Provider | 'smtp', TransporterCreator>();

export function registerTransporter(key: Provider | 'smtp', creator: TransporterCreator): void {
  registry.set(key, creator);
}

export function resolveTransporter(key: Provider | 'smtp', defaults: IDefaults, cfg: ITransporterConfiguration): Transporter<any> {
  const creator = registry.get(key);

  if (!creator) {
    throw new Error(`Provider "${key}" is not registered. Import "cliam/providers/${key}" to register it, or import "cliam" for all providers.`);
  }

  return creator(defaults, cfg);
}
