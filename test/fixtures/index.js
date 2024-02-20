exports.cliamrc = require('./cliamrc');
exports.providers = [
  'brevo',
  'mailersend',
  'mailgun',
  'mailjet',
  'postmark',
  'sendinblue',
  'sendgrid',
  'sparkpost'
];
exports.transporters = [
  'brevo-api',
  'mailersend-api',
  'mailgun-api',
  'mailjet-api',
  'postmark-api',
  'sendinblue-api',
  'sendgrid-api',
  'sparkpost-api',
  'hosting-smtp'
];
exports.requestPayload = require('./request-payload');