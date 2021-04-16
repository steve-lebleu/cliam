import { Transporter } from './../transporter.class';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IMailgunError } from './IMailgunError.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { ITransporter } from './../ITransporter.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';
import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';
/**
 * This class set a Mailgun transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-mailgun-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-mailgun-transport
 * @see https://documentation.mailgun.com/en/latest/index.html
 */
export declare class MailgunTransporter extends Transporter implements ITransporter {
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
     * @description Format email address according to Mailgun requirements
     *
     * @param recipient
     */
    address(recipient: string | IAddressable): string;
    /**
     * @description Format email addresses according to Mailgun requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients: Array<string | IAddressable>): Array<string>;
    /**
     * @description Build body request according to Mailgun requirements
     */
    build({ ...args }: IBuildable): Record<string, unknown>;
    /**
     * @description Format API response
     *
     * @param response Response from Mailgun API
     */
    response(response: Record<string, unknown>): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Mailgun API
     */
    error(error: IMailgunError): SendingError;
}
