import { Mailer } from './../services/mailer.service';

import { IPayload } from './../types/interfaces/IPayload.interface';

import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';

/**
 * @description
 */
export class Subscriber {

  /**
   * @description
   */
  event: string;

  constructor(event: string) {
    this.event = event;
  }

  /**
   * @description
   */
  async handler(event: string, payload: IPayload, origin?: string): Promise<SendingResponse|SendingError> {
    return Mailer.send(event, payload);
  }

}