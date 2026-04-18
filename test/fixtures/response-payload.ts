export default (transporter: string) => {
  switch (transporter) {
    case 'mailjet-api':
      return { response: { config: { url: 'https://website.com', method: 'POST', headers: {}, data: 'data' }, headers: {}, request: { res: { httpVersion: 1 } }, status: 200, statusText: 'OK' } };
    case 'mailgun-api':
      return { message: 'this is a response' };
    case 'mailersend-api':
      return { headers: { server: 'nginx', 'x-message-id': 'id' }, body: 'body', statusCode: 200 };
    case 'mandrill-api':
      return { messageId: 'id', accepted: [{ _id: 'id', email: 'email', status: 'status', queue_reason: 'reason' }], rejected: [] };
    case 'brevo-api':
      return { messageId: 'id', envelope: {} };
    case 'sendinblue-api':
      return { messageId: 'id', res: { httpVersion: '1', method: 'POST', statusMessage: 'OK', req: { protocol: 'https', host: 'sendinblue.com', path: 'smtp/email' } } };
    case 'sendgrid-api':
      return [{ request: { uri: 'https://sendgrid.com', method: 'POST', body: 'body' }, httpVersion: '1', headers: {}, statusMessage: 'OK' }];
    case 'postmark-api':
      return { messageId: 'id', accepted: [{ ErrorCode: 0, Message: 'message', MessageId: 'id', SubmittedAt: Date.now(), To: 'email@address.com' }] };
    case 'sparkpost-api':
    case 'hosting-smtp':
      return { messageId: 'id', accepted: 1, rejected: 0 };
  }
};
