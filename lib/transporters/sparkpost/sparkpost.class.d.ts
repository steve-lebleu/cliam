import { Transporter } from '../transporter.class';
import { ITransporter } from '../ITransporter.interface';
import { ISparkpostError } from './ISparkpostError.interface';
import { IBuildable } from '../../types/interfaces/IBuildable.interface';
import { IAddressable } from '../../types/interfaces/addresses/IAddressable.interface';
import { ISparkpostBody } from './ISparkpostBody.interface';
import { IAddressD } from '../../types/interfaces/addresses/IAddressD.interface';
import { ISendMail } from '../../types/interfaces/ISendMail.interface';
import { SendingError } from '../../classes/sending-error.class';
import { SendingResponse } from '../../classes/sending-response.class';
/**
 * Set a Sparkpost transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sparkpost-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sparkpost-transport
 * @see https://app.sparkpost.com
 * @see https://developers.sparkpost.com/api/
 */
export declare class SparkpostTransporter extends Transporter implements ITransporter {
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
     * @description Build body request according to Sparkpost requirements
     */
    build({ ...args }: IBuildable): ISparkpostBody;
    /**
     * @description Format email address according to Sparkpost requirements
     *
     * @param recipient
     */
    address(recipient: string | IAddressable): IAddressD;
    /**
     * @description Format email addresses according to Sparkpost requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients: Array<string | IAddressable>): IAddressD[];
    /**
     * @description Format API response
     *
     * @param response Response from Sparkpost API
     */
    response(response: Record<string, unknown>): SendingResponse;
    /**
     * @description Format error output
     *
     * @param error Error from Sparkpost API
     */
    error(error: ISparkpostError): SendingError;
}
