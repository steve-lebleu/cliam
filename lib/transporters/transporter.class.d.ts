import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
import { ISendMail } from './../types/interfaces/ISendMail.interface';
import { IBuildable } from './../types/interfaces/IBuildable.interface';
/**
 * Main Transporter class
 */
export declare abstract class Transporter {
    /**
     * @description Wrapped concrete transporter instance
     */
    transporter: ISendMail;
    constructor();
    /**
     * @description
     *
     * @param err
     */
    error(err: any): any;
    /**
     * @description
     *
     * @param err
     */
    response(res: any): any;
    /**
     * @description
     *
     * @param err
     */
    build({ ...args }: IBuildable): any;
    /**
     * @description Send email
     *
     * @returns
     */
    send(body: Record<string, unknown>): Promise<SendingResponse | SendingError>;
}
