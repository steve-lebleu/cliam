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

/**
 * @description Representation of cliamrc file
 */
export class ClientConfiguration {
  /**
   * @description Enable / disable sandbox mode
   */
  sandbox: boolean

  /**
   * @description Values used by Cliam to send emails
   */
  variables: {
    domain: string
    addresses: {
      from: IAddressable,
      replyTo: IAddressable
    };
  }

  /**
   * @description Values used by render engine as placeholder values in templates
   */
  placeholders?: IPlaceholder;

  /**
   * @description Array of Transporters instances defined in cliamrc
   */
  transporters: ITransporterConfiguration[]

  constructor(payload: Record<string,unknown>) {
    Object.assign(this, payload);
  }
}
