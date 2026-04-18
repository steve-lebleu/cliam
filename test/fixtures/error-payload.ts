export default (transporter: string) => {
  switch (transporter) {
    case 'mailjet-api':
      return { response: { res: { text: '{ "ErrorMessage": [ { "status": "200", "statusCode": "200", "statusText": "text" } ] }' } }, statusCode: 500, ErrorMessage: 'error' };
    case 'mailgun-api':
      return { message: 'this is a response' };
    case 'mandrill-api':
      return { messageId: 'id', accepted: [], rejected: [{ _id: 'id', email: 'email', status: 'status', reject_reason: 'reason' }] };
    case 'mailersend-api':
      return { name: 'MailersendError', statusText: 'KO', statusCode: 200, message: 'message', body: { message: 'message', errors: 'errors' } };
    case 'brevo-api':
    case 'sendinblue-api':
      return { code: 400, message: '400' };
    case 'sendgrid-api':
    case 'postmark-api':
    case 'hosting-smtp':
      return new Error('Dummy error');
    case 'sparkpost-api':
      return { statusCode: 400, errors: [{ message: 'error', description: 'description' }] };
  }
};
