export interface ISmtpTransport {
  options?: Record<string, unknown>;
  sendMail: (body: unknown) => Promise<unknown>;
}
