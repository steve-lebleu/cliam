/**
 * @description
 */
export interface ISendMail {
  options?: any;
  sendMail: ( body: any, callback: (err, result) => void ) => void
}