import { Transporter } from './../transporter.class';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { ISendgridResponse } from './ISendgridResponse.interface';
import { ITransporter } from './../ITransporter.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ISendgridError } from './ISendgridError.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';
import { SendingResponse } from './../../classes/sending-response.class';
import { SendingError } from './../../classes/sending-error.class';
/**
 * Set a Sendgrid transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sendgrid
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sendgrid
 * @see https://sendgrid.com/
 * @see https://sendgrid.com/docs/API_Reference/api_v3.html
 */
export declare class SendgridTransporter extends Transporter implements ITransporter {
    /**
     * @description Wrapped concrete transporter instance
     */
    transporter: ISendMail;
    /**
     * @description
     *
     * @param transporterEngine
     * @param domain Domain which do the request
     */
    constructor(transporterEngine: ISendMail);
    /**
     * @description Build body request according to Mailjet requirements
     */
    build({ ...args }: IBuildable): Record<string, unknown>;
    /**
     * @description Format email address according to Sendgrid requirements
     *
     * @param recipient  Entry to format as email address
     * @param type Discriminator
     */
    address(recipient: string | IAddressable, type?: string): string | IAddressB;
    /**
     * @description Format email addresses according to Sendgrid requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients: Array<string | IAddressable>): Array<string | IAddressB>;
    /**
     * @description Format API response
     *
     * @param response Response from Sendgrid API
     */
    response(response: ISendgridResponse[]): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Sendgrid API
     */
    error(error: ISendgridError): SendingError;
}
