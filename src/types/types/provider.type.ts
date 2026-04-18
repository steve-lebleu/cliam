export const PROVIDER = {
  brevo: 'brevo',
  mailersend: 'mailersend',
  mailgun: 'mailgun',
  mailjet: 'mailjet',
  mandrill: 'mandrill',
  postmark: 'postmark',
  sendgrid: 'sendgrid',
  resend: 'resend',
  sparkpost: 'sparkpost'
} as const;

/**
 * @description
 */
export type Provider = typeof PROVIDER[keyof typeof PROVIDER];
