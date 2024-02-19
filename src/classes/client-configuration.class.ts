import { IPlaceholder } from './../types/interfaces/IPlaceholder.interface';
import { IAddressable } from './../types/interfaces/addresses/IAddressable.interface';
import { ITransporterDefinition } from './../types/interfaces/ITransporter.interface';

/**
 * @description
 */
class ClientConfiguration {

  sandbox: boolean

  variables: {
    domain: string
    addresses: {
      from: IAddressable,
      replyTo: IAddressable
    };
  }

  placeholders?: IPlaceholder;

  transporters: ITransporterDefinition[]

  constructor(payload: Record<string,unknown>) {
    Object.assign(this, payload);
  }
}

export { ClientConfiguration }