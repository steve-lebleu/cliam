import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core.ts',
    'src/transporters/smtp/index.ts',
    'src/transporters/brevo/index.ts',
    'src/transporters/mailersend/index.ts',
    'src/transporters/mailgun/index.ts',
    'src/transporters/mailjet/index.ts',
    'src/transporters/mandrill/index.ts',
    'src/transporters/postmark/index.ts',
    'src/transporters/sendgrid/index.ts',
    'src/transporters/resend/index.ts',
    'src/transporters/sparkpost/index.ts',
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: false,
});
