import { Transporter } from './../types/types/transporter.type';
/**
 * @description
 *
 * @todo LOW :: Rename as WebApiProvider
 */
export declare class Provider {
    /**
     * @description
     */
    name: Transporter;
    /**
     * @description
     */
    credentials: {
        /**
         * @description
         */
        key: string;
        /**
         * @description
         */
        token: string;
    };
    /**
     * @description
     */
    templates: any;
    /**
     * @description
     */
    domains: string[];
    constructor(payload: Record<string, unknown>);
}
