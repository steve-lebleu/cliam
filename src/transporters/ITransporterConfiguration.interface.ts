import type { ITransporterCredentials } from '@transporters/ITransporterCredentials.interface';
import type { ITransporterOptions } from '@transporters/ITransporterOptions.interface';
import type { Provider } from '@typings/provider.type';

/**
 * @description Define how a transporter configuration must be formed.
 */
export interface ITransporterConfiguration {
  id: string;
  provider: Provider;
  auth: ITransporterCredentials;
  options: ITransporterOptions;
  templates?: Record<string, string>;
}
