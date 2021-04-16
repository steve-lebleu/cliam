import { Transporter } from './../transporters/transporter.class';
import { ClientConfiguration } from './../classes/client-configuration.class';
/**
 * @description
 *
 * @todo LOW :: Refactoring : should be simplified / cleaned : reading should not be here, this.transporter & this.configuration should be in a slot
 */
declare class Container {
    /**
     * @description
     */
    private static instance;
    /**
     * @description
     */
    configuration: ClientConfiguration;
    /**
     * @description
     */
    transporter: Transporter;
    /**
     * @description
     */
    private readonly PATH;
    private constructor();
    /**
     * @description
     */
    static get(): Container;
    /**
     * @description
     */
    private set;
    /**
     * @description
     *
     * @param path
     */
    private read;
    /**
     * @description
     *
     * @param configuration
     */
    private validates;
}
declare const service: Container;
export { service as Container };
