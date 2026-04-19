import type { HttpSuccess } from '../../src/services/http.service';
import type { ISmtpResponse } from '../../src/transporters/smtp/ISmtpResponse.interface';

const ok = <T>(data: T, headers: Record<string, string> = {}): HttpSuccess<T> => ({
  ok: true,
  status: 202,
  headers,
  data,
});

export default (transporter: string): HttpSuccess<unknown> | ISmtpResponse => {
  switch (transporter) {
    case 'mailjet-api':
      return ok({ Messages: [{ Status: 'success', To: [{ MessageID: 1, MessageUUID: 'uuid', Email: 'test@test.com', MessageHref: '' }] }] });
    case 'mailgun-api':
      return ok({ id: '<msg-id>', message: 'Queued. Thank you.' });
    case 'mailersend-api':
      return ok(null, { server: 'nginx', 'x-message-id': 'id' });
    case 'mandrill-api':
      return ok([{ _id: 'id', email: 'email@test.com', status: 'sent', reject_reason: null }]);
    case 'brevo-api':
      return ok({ messageId: 'id', envelope: { from: 'test@test.com', to: ['test@test.com'] } });
    case 'sendgrid-api':
      return ok(null, { 'x-message-id': 'id', server: 'nginx' });
    case 'postmark-api':
      return ok({ To: 'test@test.com', SubmittedAt: '2021-01-01T00:00:00Z', MessageID: 'id', ErrorCode: 0, Message: 'OK' });
    case 'resend-api':
      return ok({ id: 'id', object: 'email', from: 'test@test.com', to: ['test@test.com'], created_at: '2024-01-01T00:00:00Z' });
    case 'ses-api':
      return ok({ MessageId: '0102017e8c0e123456-abc' });
    case 'sparkpost-api':
      return ok({ results: { id: 'id', total_accepted_recipients: 1, total_rejected_recipients: 0 } });
    case 'hosting-smtp':
      return { messageId: 'id', accepted: ['test@test.com'], rejected: [], response: '250 OK', envelope: { from: 'test@test.com', to: ['test@test.com'] } };
  }
};
