/**
 * @description Define supported email transporters
 */
export enum TRANSPORTER {
  sparkpost = 'sparkpost',
  sendgrid = 'sendgrid',
  sendinblue = 'sendinblue',
  mandrill = 'mandrill',
  mailgun = 'mailgun',
  mailjet = 'mailjet',
  postmark = 'postmark',
  smtp = 'smtp'
}