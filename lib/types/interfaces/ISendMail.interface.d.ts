/**
 * @description
 */
export interface ISendMail {
    options?: any;
    sendMail: (body: any, callback: (err: any, result: any) => void) => void;
}
