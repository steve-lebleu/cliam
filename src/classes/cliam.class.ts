import { Container } from './../services/container.service';
import { Event } from './../types/types/event.type';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { SendingResponse } from './sending-response.class';
import { SendingError } from './sending-error.class';
import { ClientConfiguration } from './client-configuration.class';
import { Mailer } from './../services/mailer.service';

/**
 * @summary Main class of cliam project. The Cliam class act as entry point and open wrapped methods such subscribe and emit.
 *
 * @public
 */
class Cliam {

  /**
   * @description
   */
  private static instance: Cliam = null;

  /**
   * @description
   */
  private mailers: { [id:string]: Mailer } = {};

  /**
   * @description
   */
  private events: string[] = [
    'default',
    'event.subscribe',
    'event.unsubscribe',
    'event.updated',
    'user.bye',
    'user.confirm',
    'user.contact',
    'user.invite',
    'user.progress',
    'user.survey',
    'user.welcome',
    'order.invoice',
    'order.progress',
    'order.shipped',
    'password.request',
    'password.updated',
  ];

  private constructor() {}

  /**
   *
   * @param emitter
   */
  static get(): Cliam {
    if (!Cliam.instance) {
      Cliam.instance = new Cliam();
    }
    return Cliam.instance;
  }

  /**
   * @description
   */
  async emit(event: Event|string, payload: IPayload): Promise<SendingResponse|SendingError> {
    if (!this.mailers[payload.transporter]) {
      this.mailers[payload.transporter] = new Mailer(Container.transporters[payload.transporter], Container.configuration.transporters.find(transporter => transporter.id === payload.transporter));
    }
    return this.mailers[payload.transporter].send(event, payload)
  }
}

const cliam = Cliam.get() as { emit: (event: Event|string, payload: IPayload) => Promise<SendingResponse | SendingError> };

export { cliam as Cliam }