const BlockMailer = require(process.cwd() + '/test/utils/blocks/mailer');

describe('API', async () => {

  // TODO: Sendgrid -> nodemailer-mock failure in SendingError
  // TODO: Brevo -> timeout nodemailer-mock failure
  ['mailgun', 'sparkpost', 'postmark', 'mailjet'].forEach(provider => {
    BlockMailer(provider)
  });

});