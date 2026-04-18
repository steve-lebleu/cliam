import type { IAddressable } from '@/types/interfaces/addresses/IAddressable.interface';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import { resolveTransporter } from './registry';
import type { Transporter } from './transporter.class';

export class TransporterFactory {
  private constructor() {}

  static get({ ...vars }: { domain: string; addresses: { from: IAddressable; replyTo: IAddressable } }, { ...args }: ITransporterConfiguration): Transporter {
    return resolveTransporter(args.provider ?? 'smtp', vars, args);
  }
}
