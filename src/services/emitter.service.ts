import { ClientConfiguration } from './../classes/client-configuration.class';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
import { Subscriber } from './../services/subscriber.service';

import { Event } from './../types/types/event.type';

/**
 * @summary
 */
class Emitter {

  /**
   * @description
   */
  private static instance: Emitter = null;

  /**
   * @description
   */
  private subscribers: Subscriber[] = [];

  /**
   * @description
   */
  private configuration: ClientConfiguration = null;

  private constructor(configuration: ClientConfiguration) {
    this.configuration = configuration;
  }

  /**
   * @description
   *
   * @param emitter
   */
  static get(configuration: ClientConfiguration): Emitter {
    if (!Emitter.instance) {
      Emitter.instance = new Emitter(configuration);
    }
    return Emitter.instance;
  }

  /**
   * @description
   *
   * @param event
   */
  subscribe(event: Event|string): void {
    if ( this.subscribers.filter(subscriber => subscriber.event === event).length === 0 ) {
      this.subscribers.push( new Subscriber(event) );
    }
  }

  /**
   * @description
   *
   * @param event
   */
  unsubscribe(event: Event|string): void {
    const idx = this.subscribers.findIndex(entry => entry.event === event);
    if (idx) {
      this.subscribers.splice(idx, 1);
    }
  }

  /**
   * @description
   *
   * @param event
   */
  list(event: Event|string = null): any[] {
    return this.subscribers.filter(subscriber => event ? subscriber.event === event : true).map( subscriber => subscriber.event );
  }

  /**
   * @description
   */
  count(): number {
    return this.subscribers.length;
  }

  /**
   * @description
   *
   * @param event
   */
  async emit(event: Event|string, payload: IPayload): Promise<SendingResponse|SendingError> {
    return this.subscribers.find(subscriber => subscriber.event === event)?.handler(event, payload);
  }

}

export { Emitter }