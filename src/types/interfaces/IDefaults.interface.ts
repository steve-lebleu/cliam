import type { IAddressable } from './IAddressable.interface';

export interface IDefaults {
  addresses: { from: IAddressable; replyTo: IAddressable };
}
