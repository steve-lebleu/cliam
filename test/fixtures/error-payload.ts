export default (transporter: string) => {
  switch (transporter) {
    case 'mailjet-api':
      return { statusCode: 500, ErrorMessage: 'error message' };
    case 'mailgun-api':
      return { status: 400, type: 'BadRequest', details: 'Invalid domain' };
    case 'mandrill-api':
      return { code: -1, name: 'ValidationError', message: 'Validation error' };
    case 'mailersend-api':
      return { name: 'MailersendError', statusCode: 422, body: { message: 'Unprocessable Entity', errors: 'errors' } };
    case 'brevo-api':
      return { code: 400, message: '400' };
    case 'sendgrid-api':
    case 'postmark-api':
      return new Error('Dummy error');
    case 'hosting-smtp':
      return Object.assign(new Error('Invalid address'), { responseCode: 550, code: 'EENVELOPE', response: '550 Invalid address' });
    case 'resend-api':
      return { name: 'validation_error', message: 'Invalid email address', statusCode: 422 };
    case 'ses-api':
      return { __type: 'MessageRejected', message: 'Email address is not verified.' };
    case 'sparkpost-api':
      return { statusCode: 400, errors: [{ message: 'error', description: 'description' }] };
  }
};
