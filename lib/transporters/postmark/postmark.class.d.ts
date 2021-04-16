import { Transporter } from './../transporter.class';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IPostmarkError } from 'transporters/postmark/IPostmarkError.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';
import { SendingResponse } from './../../classes/sending-response.class';
import { SendingError } from './../../classes/sending-error.class';
import { IPostmarkBody } from './IPostmarkBody.interface';
/**
 * Set a Postmark transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-postmark-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-postmark-transport
 * @see https://postmarkapp.com/developer
 */
export declare class PostmarkTransporter extends Transporter {
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
    build({ ...args }: IBuildable): IPostmarkBody;
    /**
     * @description Format email address according to Postmark requirements
     *
     * @param recipient
     */
    address(recipient: string | IAddressable): string;
    /**
     * @description Format email addresses according to Postmark requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients: Array<string | IAddressable>): Array<string>;
    /**
     * @description Format API response
     *
     * @param response Response from Postmark API
     */
    response(response: Record<string, unknown>): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Postmark API
     */
    error(error: IPostmarkError): SendingError;
}
