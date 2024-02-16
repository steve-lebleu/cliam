const BlockMailer = require(process.cwd() + '/test/utils/blocks/mailer');

describe('API', async () => {

  // TODO: fix mailjet, sendgrid, sendinblue
  // Mailjet: timeout nodemailer-mock failure
  // sendgrid nodemailer-mock failure in SendingError
  // sendinblue timeout nodemailer-mock failure
  // ['mailjet', 'sendgrid', 'sendinblue'].forEach(provider => {
  ['mailgun', 'sparkpost', 'postmark', 'mailjet'].forEach(provider => {
    BlockMailer(provider)
  });

});