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
    case 'hosting-smtp':
      return new Error('Dummy error');
    case 'sparkpost-api':
      return { statusCode: 400, errors: [{ message: 'error', description: 'description' }] };
  }
};
