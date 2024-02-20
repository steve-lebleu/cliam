const { E2ETransporterBlock } = require(process.cwd() + '/test/e2e/00-transporter-block.test');

describe('API', async () => {

  ['mailgun', 'sparkpost', 'postmark', 'mailjet', 'brevo'].forEach(provider => {
    E2ETransporterBlock(provider)
  });

});