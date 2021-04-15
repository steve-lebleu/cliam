/**
 * @description
 */
export class Smtp {

  /**
   * @description
   */
  host: string;

  /**
   * @description
   */
  port: number;

  /**
   * @description
   */
  secure: boolean;

  /**
   * @description
   */
  username: string;

  /**
   * @description
   */
  password: string;

  constructor(payload: Record<string,unknown>) {
    Object.assign(this, payload);
  }
}