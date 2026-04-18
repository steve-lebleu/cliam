/**
 * @description Describe the required properties for an instance of mailer transporter
 */
export interface ITransporterMailer {
  options?: any;
  sendMail: (body: any) => Promise<any>;
}
