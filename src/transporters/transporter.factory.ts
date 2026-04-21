import type { IDefaults } from '@interfaces/IDefaults.interface';
import type { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import { resolveTransporter } from './transporter.registry';
import type { Transporter } from './transporter.class';

export class TransporterFactory {
  private constructor() {}

  static get({ ...defaults }: IDefaults, { ...cfg }: ITransporterConfiguration): Transporter<any> {
    return resolveTransporter(cfg.provider ?? 'smtp', defaults, cfg);
  }
}
