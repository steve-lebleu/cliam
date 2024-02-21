module.exports = (transporter) => {
  switch(transporter) {
    case 'mailjet-api':
      return  { response: { res: { text: '{ "ErrorMessage": [ { "status": "200", "statusCode": "200", "statusText": "text" } ] }' } }, statusCode: 500, ErrorMessage: 'error' };
      break;
    case 'mailgun-api':
      return { message: 'this is a response' };
      break;
    case 'mandrill-api':
      return { messageId: 'id', accepted: [], rejected: [{ _id: 'id', email: 'email', status: 'status', reject_reason: 'reason' }] };
      break;
    case 'mailersend-api':
      return { name: 'MailersendError', statusText: 'KO', statusCode: 200, message: 'message', body: { message: 'message', errors: 'errors' } };
      break;
    case 'brevo-api':
      return { code: 400, message: '400' };
      break;
    case 'sendinblue-api':
      return { code: 400, message: '400' };
      break;
    case 'sendgrid-api':
      return new Error('Dummy error');
      break;
    case 'postmark-api':
      return new Error('Dummy error');
      break;
    case 'sparkpost-api':
      return { statusCode: 400, errors: [{ message: 'error', description: 'description' }] };
      break;
    case 'hosting-smtp':
      return new Error('Dummy error');
      break;
  };
};