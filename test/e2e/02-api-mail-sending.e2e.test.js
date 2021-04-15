const BlockMailer = require(process.cwd() + '/test/utils/blocks/mailer');

describe('API', async () => {

  // TODO sendinblue with a sandbox
  // TODO sendgrid error mock
  ['mailgun', 'mailjet', 'postmark', 'sparkpost'].forEach(provider => {
    BlockMailer(provider)
  });

});