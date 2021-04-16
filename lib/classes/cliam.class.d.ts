import { Event } from './../types/types/event.type';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { SendingResponse } from './sending-response.class';
import { SendingError } from './sending-error.class';
declare const cliam: {
    emit: (event: Event, payload: IPayload) => Promise<SendingResponse | SendingError>;
    subscribe: (event: Event | string) => void;
};
export { cliam as Cliam };
