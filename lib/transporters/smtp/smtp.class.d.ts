import { Transporter } from './../transporter.class';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { ISMTPResponse } from './ISMTPResponse.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IGmailError } from './IGmailError.interface';
import { IInfomaniakError } from './IInformaniakError.interface';
import { ISMTPError } from './ISMTPError.interface';
import { ITransporter } from './../ITransporter.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';
import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';
/**
 * Set a Nodemailer SMTP transporter for mail sending.
 *
 * @dependency nodemailer
 *
 * @see https://nodemailer.com/smtp/
 */
export declare class SmtpTransporter extends Transporter implements ITransporter {
    /**
     * @description Wrapped concrete transporter instance
     */
    transporter: ISendMail;
    /**
     * @description
     */
    constructor(transporterEngine: ISendMail);
    /**
     * @description Build body request according to Mailjet requirements
     */
    build({ ...args }: IBuildable): Record<string, unknown>;
    /**
     * @description Format email address according to SMTP requirements
     *
     * @param recipient
     */
    address(recipient: string | IAddressable): string;
    /**
     * @description Format email addresses according to SMTP requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients: Array<string | IAddressable>): Array<string>;
    /**
     * @description Format API response
     *
     * @param response Response from Nodemailer SMTP API
     */
    response(response: ISMTPResponse): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Nodemailer SMTP API
     *
     * @fixme Non managed error with smtp.gmail.com and secure true : error have a different pattern and this regError.exec(error.response)[0] not working
     */
    error(error: Error | IGmailError | IInfomaniakError | ISMTPError): SendingError;
}
