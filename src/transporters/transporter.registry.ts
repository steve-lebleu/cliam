import type { IAddressable } from '@/types/interfaces/IAddressable.interface';
import type { Provider } from '@typings/provider.type';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import type { Transporter } from './transporter.class';

export type TransporterVars = { domain: string; addresses: { from: IAddressable; replyTo: IAddressable } };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransporterCreator = (vars: TransporterVars, args: ITransporterConfiguration) => Transporter<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = new Map<Provider | 'smtp', TransporterCreator>();

export function registerTransporter(key: Provider | 'smtp', creator: TransporterCreator): void {
  registry.set(key, creator);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveTransporter(key: Provider | 'smtp', vars: TransporterVars, args: ITransporterConfiguration): Transporter<any> {
  const creator = registry.get(key);

  if (!creator) {
    throw new Error(`Provider "${key}" is not registered. Import "cliam/providers/${key}" to register it, or import "cliam" for all providers.`);
  }

  return creator(vars, args);
}
