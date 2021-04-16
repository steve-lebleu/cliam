import { IPayload } from './../types/interfaces/IPayload.interface';
import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
/**
 * @description
 */
export declare class Subscriber {
    /**
     * @description
     */
    event: string;
    constructor(event: string);
    /**
     * @description
     */
    handler(event: string, payload: IPayload, origin?: string): Promise<SendingResponse | SendingError>;
}
