import 'dotenv/config';
import { createRequire } from 'node:module';

const _require = createRequire(import.meta.url);

export const cliamrc = _require('./cliamrc');

export const transporters: string[] = [
  'brevo-api',
  'mailersend-api',
  'mailgun-api',
  'mailjet-api',
  'mandrill-api',
  'postmark-api',
  'sendgrid-api',
  'sparkpost-api',
  'hosting-smtp'
];

export { default as errorPayload } from './error-payload';
export { default as requestPayload } from './request-payload';
export { default as responsePayload } from './response-payload';
