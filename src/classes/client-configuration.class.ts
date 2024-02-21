import { IPlaceholder } from './../types/interfaces/IPlaceholder.interface';
import { IAddressable } from './../types/interfaces/addresses/IAddressable.interface';
import { ITransporterConfiguration } from '../transporters/ITransporterConfiguration.interface';

/**
 * @description Representation of cliamrc file
 */
class ClientConfiguration {

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

export { ClientConfiguration }