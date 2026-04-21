import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core.ts',
    'src/types.ts',
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
    'src/transporters/ses/index.ts',
  ],
  format: ['esm'],
  dts: true,
  clean: false,
  sourcemap: false,
  minify: false,
  terserOptions: {
    compress: {
      drop_console: false, // Empêche explicitement la suppression
    },
  },
});
