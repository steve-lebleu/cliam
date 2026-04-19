export default (transporter: string) => {
  switch (transporter) {
    case 'mailjet-api':
      return { ErrorIdentifier: 'uuid', ErrorCode: 'mj-0004', StatusCode: 400, ErrorMessage: 'error message', ErrorRelatedTo: [] };
    case 'mailgun-api':
      return { message: 'Invalid domain' };
    case 'mandrill-api':
      return { status: 'error', code: -1, name: 'ValidationError', message: 'Validation error' };
    case 'mailersend-api':
      return { name: 'MailersendError', statusCode: 422, body: { message: 'Unprocessable Entity', errors: 'errors' } };
    case 'brevo-api':
      return { code: 400, message: '400' };
    case 'sendgrid-api':
      return { errors: [{ message: 'Invalid email address', field: 'to', help: null }] };
    case 'postmark-api':
      return { ErrorCode: 400, Message: 'Bad Request' };
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
