import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { Transporter } from './../transporters/transporter.class';
/**
 * @description Manage incoming mail requests
 */
declare class Mailer {
    /**
     * @description
     */
    private static instance;
    /**
     * @description
     */
    private transporter;
    constructor(transporter: Transporter);
    /**
     * @description
     */
    static get(transporter: Transporter): Mailer;
    /**
     * @description Send email
     */
    send: (event: string, payload: IPayload) => Promise<SendingResponse | SendingError>;
    /**
     * @description
     *
     * @param event
     * @param payload
     */
    private setAddresses;
    /**
     * @description
     *
     * @param event
     * @param payload
     */
    private setCompiler;
    /**
     * @description
     *
     * @param event
     * @param payload
     */
    private getBuildable;
    /**
     * @description
     */
    private getOrigin;
    /**
     * @description
     */
    private getTemplateId;
    /**
     * @description
     */
    private hasPlainText;
    /**
     * @description
     */
    private getCompilated;
}
declare const service: Mailer;
export { service as Mailer };
