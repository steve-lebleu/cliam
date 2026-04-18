import type { ITransporterCredentials } from '@transporters/ITransporterCredentials.interface';
import type { ITransporterOptions } from '@transporters/ITransporterOptions.interface';
import type { PROVIDER } from '@enums/provider.enum';

/**
 * @description Define how a transporter configuration must be formed.
 */
export interface ITransporterConfiguration {
  id: string
  provider: PROVIDER
  auth: ITransporterCredentials
  options: ITransporterOptions // FIXME: templates is present also in options
  templates?: Record<string, string>[]
}
