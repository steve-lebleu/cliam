const BlockMailer = require(process.cwd() + '/test/utils/blocks/mailer');

describe('API', async () => {

  // TODO: Sendgrid -> nodemailer-mock failure in SendingError

  ['mailgun', 'sparkpost', 'postmark', 'mailjet', 'brevo'].forEach(provider => {
    BlockMailer(provider)
  });

});