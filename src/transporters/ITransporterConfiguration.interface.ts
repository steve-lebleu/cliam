import type { PROVIDER } from '@typings/enums/provider.enum';
import { ITransporterOptions } from '@transporters/ITransporterOptions.interface';
import { ITransporterCredentials } from '@transporters/ITransporterCredentials.interface';

/**
 * @description Define how a transporter configuration must be formed.
 */
export interface ITransporterConfiguration {
  id: string
  provider: PROVIDER
  auth: ITransporterCredentials
  options: ITransporterOptions
  templates?: Record<string, string>[]
}
