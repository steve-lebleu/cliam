import { Transporter } from './../transporter.class';
import { IBuildable } from './../../types/interfaces/IBuildable.interface';
import { IAddressable } from './../../types/interfaces/addresses/IAddressable.interface';
import { IAddressB } from './../../types/interfaces/addresses/IAddressB.interface';
import { IMandrillResponse } from 'transporters/mandrill/IMandrillResponse.interface';
import { ITransporter } from './../ITransporter.interface';
import { ISendMail } from './../../types/interfaces/ISendMail.interface';
import { SendingError } from './../../classes/sending-error.class';
import { SendingResponse } from './../../classes/sending-response.class';
/**
 * Set a Mandrill transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-mandrill-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-mandrill-transport
 * @see https://mandrillapp.com/api/docs/
 * @see https://bitbucket.org/mailchimp/mandrill-api-node/src
 */
export declare class MandrillTransporter extends Transporter implements ITransporter {
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
     * @description Build body request according to Mailgun requirements
     */
    build({ ...args }: IBuildable): Record<string, unknown>;
    /**
     * @description Format email address according to Mandrill requirements
     *
     * @param recipient Entry to format as email address
     * @param type type Discriminator for body property settings
     */
    address(recipient: string | IAddressable, type?: string): string | IAddressB;
    /**
     * @description Format email addresses according to Mandrill requirements
     *
     * @param recipients Entries to format as email address
     * @param type Discriminator for body property settings
     */
    addresses(recipients: Array<string | IAddressable>, type?: string): Array<string | IAddressB>;
    /**
     * @description Format API response
     *
     * @param response Response from Mandrill API
     */
    response(response: IMandrillResponse[]): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Mandrill API
     */
    error(error: Error): SendingError;
}
