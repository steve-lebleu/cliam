import { Transporter as TransporterType } from '../types/types/transporter.type';
import { Smtp } from '../classes/smtp.class';
import { Transporter } from './transporter.class';
/**
 * @description
 */
export declare class TransporterFactory {
    private static engine;
    constructor();
    /**
     * @description Get a concrete transporter instance
     *
     * @param key
     */
    static get(key: TransporterType, { ...args }: {
        apiKey?: string;
        token?: string;
        smtp?: Smtp;
        domain?: string;
    }): Transporter;
}
/**
 * après création, pour le smtp ? OU ailleurs en fait
 * this.transporter.verify( (err, res) => {
        if (err) {
          reject(this.error(err));
        }
        resolve(this.transporter);
      });
 */ 
