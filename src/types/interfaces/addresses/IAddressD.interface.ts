import { IAddressB } from './IAddressB.interface';

export interface IAddressD {
  address: string | IAddressB;
  header_to?: string;
  email?: string;
}