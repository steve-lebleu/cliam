const BlockMailer = require(process.cwd() + '/test/utils/blocks/mailer');

describe('API', async () => {

  // TODO: Sendgrid -> nodemailer-mock failure in SendingError

  ['mailgun', 'sparkpost', 'postmark', 'mailjet', 'brevo', 'sendgrid'].forEach(provider => {
    BlockMailer(provider)
  });

});