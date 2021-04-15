import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
import { ISendMail } from './../types/interfaces/ISendMail.interface';
import { IBuildable } from './../types/interfaces/IBuildable.interface';

/**
 * Main Transporter class
 */
export abstract class Transporter {

  /**
   * @description Wrapped concrete transporter instance
   */
  public transporter: ISendMail;

  constructor() {}

  /**
   * @description
   *
   * @param err
   */
  public error(err): any {}

  /**
   * @description
   *
   * @param err
   */
  public response(res): any {}

  /**
   * @description
   *
   * @param err
   */
  public build({...args }: IBuildable): any {}

  /**
   * @description Send email
   *
   * @returns
   */
  async send(body: Record<string,unknown>): Promise<SendingResponse|SendingError> {
		return new Promise( (resolve, reject) => {
			this.transporter.sendMail( body, (err, info) => {
        if (err) {
          reject(this.error(err));
        } else {
          resolve(this.response(info));
        }
      });
		});
  }
}