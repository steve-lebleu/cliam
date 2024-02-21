const { E2ETransporterBlock } = require(process.cwd() + '/test/e2e/00-transporter-block.test');

describe('API', async () => {

  /**
   * Only transporters using nodemailer in background, except sendgrid because the nodemailer mock doesn't works
   */
  ['mailgun', 'sparkpost', 'postmark', 'brevo'].forEach(provider => {
    E2ETransporterBlock(provider)
  });
});