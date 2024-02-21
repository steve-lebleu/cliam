require('dotenv').config();

exports.cliamrc = require('./cliamrc');
exports.transporters = [
  'brevo-api',
  'mailersend-api',
  'mailgun-api',
  'mailjet-api',
  'mandrill-api',
  'postmark-api',
  'sendinblue-api',
  'sendgrid-api',
  'sparkpost-api',
  'hosting-smtp'
];
exports.errorPayload = require('./error-payload');
exports.requestPayload = require('./request-payload');
exports.responsePayload = require('./response-payload');