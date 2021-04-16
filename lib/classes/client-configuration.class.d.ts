import { Smtp } from './smtp.class';
import { Consumer } from './consumer.class';
import { Transporter } from './../types/types/transporter.type';
/**
 * @description
 */
declare class ClientConfiguration {
    sandbox?: {
        active: boolean;
        from: {
            name: string;
            email: string;
        };
        to: {
            name: string;
            email: string;
        };
    };
    consumer: Consumer;
    mode: {
        api?: {
            credentials: {
                apiKey: string;
                token?: string;
            };
            name: Transporter;
            templates: Array<{
                [event: string]: string;
            }>;
        };
        smtp?: Smtp;
    };
    constructor(payload: Record<string, unknown>);
}
export { ClientConfiguration };
