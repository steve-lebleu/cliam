import type { IPlaceholder } from '@interfaces/IPlaceholder.interface';
import type { IAddressable } from '@interfaces/addresses/IAddressable.interface';
import type { ITransporterConfiguration } from '@transporters/ITransporterConfiguration.interface';

export interface IClientConfiguration {
  sandbox?: boolean
  variables: {
    domain: string
    addresses: {
      from: IAddressable
      replyTo: IAddressable
    }
  }
  placeholders?: IPlaceholder
  transporters: ITransporterConfiguration[]
}
