import type { PROVIDER } from '@enums/provider.enum';
import type { Transporter } from './transporter.class';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import type { IAddressable } from '@/types/interfaces/addresses/IAddressable.interface';

export type TransporterVars = { domain: string; addresses: { from: IAddressable; replyTo: IAddressable } };
export type TransporterCreator = (vars: TransporterVars, args: ITransporterConfiguration) => Transporter;

const registry = new Map<PROVIDER | 'smtp', TransporterCreator>();

export function registerTransporter(key: PROVIDER | 'smtp', creator: TransporterCreator): void {
  registry.set(key, creator);
}

export function resolveTransporter(key: PROVIDER | 'smtp', vars: TransporterVars, args: ITransporterConfiguration): Transporter {
  const creator = registry.get(key);

  if (!creator) {
    throw new Error(`Provider "${key}" is not registered. Import "cliam/providers/${key}" to register it, or import "cliam" for all providers.`);
  }

  return creator(vars, args);
}
