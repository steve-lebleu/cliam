const BlockMailer = require(process.cwd() + '/test/utils/blocks/mailer');

describe('API', async () => {

  // TODO sendinblue (+sandbox), sendgrid, brevo, ...
  // To fix: mailjet, postmark
  // TODO sendgrid error mock
  ['mailgun', 'sparkpost'].forEach(provider => {
    BlockMailer(provider)
  });

});