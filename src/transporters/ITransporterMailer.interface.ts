/**
 * @description Describe the required properties for an instance of mailer transporter
 */
export interface ITransporterMailer {
  options?: any;
  sendMail: (body: any) => Promise<any>;
}
// FIXME: this interface is not clear. At least, she's only relevant for SMTP. She should be relevant for all, but in this case
// we need to clarify options property, and to rename send by sendMail method in all Http transporter implementations
