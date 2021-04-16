import { Transporter } from './../transporter.class';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { ISendinblueResponse } from './ISendinblueResponse.interface';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';
import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';
/**
 * Set a Sendinblue transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sendinblue-transport
 * @dependency Fork of nodemailer-sendinblue-transport https://github.com/konfer-be/nodemailer-sendinblue-transport.git
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sendinblue-transport
 * @see https://fr.sendinblue.com/
 * @see https://apidocs.sendinblue.com/tutorial-sending-transactional-email/
 *
 */
export declare class SendinblueTransporter extends Transporter {
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
     * @description Format email address according to Sendinblue requirements
     *
     * @param recipient  Entry to format as email address
     */
    address(recipient: string | IAddressable): IAddressB;
    /**
     * @description Format email addresses according to Sendinblue requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients: Array<string | IAddressable>): Array<IAddressB>;
    /**
     * @description Format API response
     *
     * @param response Response from Sendinblue API
     */
    response(response: ISendinblueResponse): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Sendgrid API
     */
    error(error: Error): SendingError;
}
