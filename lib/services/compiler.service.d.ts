/**
 * On the fly hbs compilation middleware
 */
declare class Compiler {
    /**
     * @description
     */
    private static instance;
    /**
     * @description
     */
    private readonly LAYOUT;
    /**
     * @description
     */
    private readonly PARTIALS;
    /**
     * @description
     */
    private readonly BLOCKS;
    /**
     * @description
     */
    private readonly TEMPLATES;
    /**
     * @description
     */
    private readonly SOCIALS;
    /**
     * @description
     */
    private readonly COLORS;
    constructor();
    /**
     * @description
     */
    static get(): Compiler;
    /**
     * @description
     *
     * @param event
     * @param data
     *
     * @todo LOW :: do better about socials and banner
     */
    compile(event: string, data: Record<string, unknown>): {
        text: string;
        html: string;
    };
    /**
     * @description
     *
     * @param html
     */
    textify(html: string): string;
    /**
     * @description
     *
     * @param event
     */
    private getBanner;
    /**
     * @description
     *
     * @param event
     */
    private getSegment;
    /**
     * @description
     *
     * @param html
     */
    private customize;
}
declare const service: Compiler;
export { service as Compiler };
