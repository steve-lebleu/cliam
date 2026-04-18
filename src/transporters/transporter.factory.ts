import { Transporter } from './transporter.class';
import { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import { IAddressable } from '@/types/interfaces/addresses/IAddressable.interface';
import { resolveTransporter } from './registry';

export class TransporterFactory {
  private constructor() {}

  static get({ ...vars }: { domain: string; addresses: { from: IAddressable; replyTo: IAddressable } }, { ...args }: ITransporterConfiguration): Transporter {
    return resolveTransporter(args.provider ?? 'smtp', vars, args);
  }
}
