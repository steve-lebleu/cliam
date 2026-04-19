import type { IAddressable } from '@/types/interfaces/IAddressable.interface';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import { resolveTransporter } from './transporter.registry';
import type { Transporter } from './transporter.class';

export class TransporterFactory {
  private constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static get({ ...vars }: { domain: string; addresses: { from: IAddressable; replyTo: IAddressable } }, { ...args }: ITransporterConfiguration): Transporter<any> {
    return resolveTransporter(args.provider ?? 'smtp', vars, args);
  }
}
