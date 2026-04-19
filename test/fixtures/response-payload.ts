import type { HttpResult } from '../../src/services/http.service';

export default (transporter: string): HttpResult | Record<string, unknown> | unknown[] => {
  switch (transporter) {
    case 'mailjet-api':
      return { Messages: [{ Status: 'success' }] };
    case 'mailgun-api':
      return { message: 'Queued. Thank you.' };
    case 'mailersend-api':
      return { status: 202, headers: { server: 'nginx', 'x-message-id': 'id' }, data: null } as HttpResult;
    case 'mandrill-api':
      return [{ _id: 'id', email: 'email@test.com', status: 'sent', reject_reason: null }];
    case 'brevo-api':
      return { messageId: 'id', envelope: {} };
    case 'sendgrid-api':
      return { status: 202, headers: { 'x-message-id': 'id' }, data: null } as HttpResult;
    case 'postmark-api':
      return { To: 'test@test.com', SubmittedAt: '2021-01-01T00:00:00Z', MessageID: 'id', ErrorCode: 0, Message: 'OK' };
    case 'resend-api':
      return { id: 'id', object: 'email', from: 'test@test.com', to: ['test@test.com'], created_at: '2024-01-01T00:00:00Z' };
    case 'ses-api':
      return { MessageId: '0102017e8c0e123456-abc' };
    case 'sparkpost-api':
      return { results: { id: 'id', total_accepted_recipients: 1, total_rejected_recipients: 0 } };
    case 'hosting-smtp':
      return { messageId: 'id', accepted: 1, rejected: 0 };
  }
};
