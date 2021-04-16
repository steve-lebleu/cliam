import { Transporter } from './../transporter.class';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressA } from './../../types/interfaces/addresses/IAddressA.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IMailjetResponse } from './IMailjetResponse.interface';
import { IMailjetError } from './IMailjetError.interface';
import { ITransporter } from './../ITransporter.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';
import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';
/**
 * Set a Mailjet transporter for mail sending.
 *
 * @dependency node-mailjet
 *
 * @see https://fr.mailjet.com/
 * @see https://github.com/mailjet/mailjet-apiv3-nodejs
 * @see https://dev.mailjet.com/guides/
 */
export declare class MailjetTransporter extends Transporter implements ITransporter {
    /**
     * @description Wrapped concrete transporter instance
     */
    transporter: ISendMail;
    /**
     * @description
     *
     * @param transporterEngine
     */
    constructor(transporterEngine: ISendMail);
    /**
     * @description Build body request according to Mailjet requirements
     */
    build({ ...args }: IBuildable): Record<string, unknown>;
    /**
     * @description Format email address according to Mailjet requirements
     *
     * @param recipient
     */
    address(recipient: string | IAddressable): IAddressA;
    /**
     * @description Format email addresses according to Mailjet requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients: Array<string | IAddressable>): IAddressA[];
    /**
     * @description Format API response
     *
     * @param response Response from Mailjet API
     */
    response(response: IMailjetResponse): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Mailgun API
     */
    error(error: IMailjetError): SendingError;
}
