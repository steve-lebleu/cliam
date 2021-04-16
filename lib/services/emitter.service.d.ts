import { ClientConfiguration } from './../classes/client-configuration.class';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
import { Event } from './../types/types/event.type';
/**
 * @summary
 */
declare class Emitter {
    /**
     * @description
     */
    private static instance;
    /**
     * @description
     */
    private subscribers;
    /**
     * @description
     */
    private configuration;
    private constructor();
    /**
     * @description
     *
     * @param emitter
     */
    static get(configuration: ClientConfiguration): Emitter;
    /**
     * @description
     *
     * @param event
     */
    subscribe(event: Event | string): void;
    /**
     * @description
     *
     * @param event
     */
    unsubscribe(event: Event | string): void;
    /**
     * @description
     *
     * @param event
     */
    list(event?: Event | string): any[];
    /**
     * @description
     */
    count(): number;
    /**
     * @description
     *
     * @param event
     */
    emit(event: Event | string, payload: IPayload): Promise<SendingResponse | SendingError>;
}
export { Emitter };
