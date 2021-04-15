import { Transporter } from '@ctypes/transporter.type';

/**
 * @description
 *
 * @todo LOW :: Rename as WebApiProvider
 */
export class Provider {

  /**
   * @description
   */
  name: Transporter;

  /**
   * @description
   */
  credentials: {

    /**
     * @description
     */
    key: string;

    /**
     * @description
     */
    token: string;

  }

  /**
   * @description
   */
  templates;

  /**
   * @description
   */
  domains: string[];

  constructor(payload: Record<string,unknown>) {
    Object.assign(this, payload);
  }

}