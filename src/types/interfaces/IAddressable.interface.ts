/**
 * Define fields of an email address object
 */
export interface IAddressable {
  /**
   * @description Email address
   */
  email: string;

  /**
   * @description Name used as address name
   */
  name?: string;
}
