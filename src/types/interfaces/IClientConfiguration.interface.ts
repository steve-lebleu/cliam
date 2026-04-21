import type { IPlaceholder } from '@interfaces/IPlaceholder.interface';
import type { IDefaults } from '@interfaces/IDefaults.interface';

import type { ITransporterConfiguration } from '@transporters/ITransporterConfiguration.interface';

export interface IClientConfiguration {
  sandbox?: boolean;
  variables: IDefaults;
  placeholders?: IPlaceholder;
  transporters: ITransporterConfiguration[];
}
