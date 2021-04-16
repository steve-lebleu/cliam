import { Event } from './../types/types/event.type';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { SendingResponse } from './sending-response.class';
import { SendingError } from './sending-error.class';
/**
 * @summary Main class of cliam project. The Cliam class act as entry point and open wrapped methods such subscribe and emit.
 *
 * @public
 */
declare class Cliam {
    /**
     * @description
     */
    private static instance;
    /**
     * @description
     */
    private emitter;
    private constructor();
    /**
     *
     * @param emitter
     */
    static get(emitter: any): Cliam;
    /**
     * @description
     *
     * @param event
     */
    subscribe(event: Event | string): void;
    /**
     * @description
     */
    emit(event: Event, payload: IPayload): Promise<SendingResponse | SendingError>;
}
declare const cliam: Cliam;
export { cliam as Cliam };
