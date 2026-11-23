/**
 * Smoke test of the built package under Node.js (not Bun).
 *
 * The unit tests run with Bun against the sources, which hides Node.js ESM runtime issues
 * (CommonJS interop, __dirname in ESM, files missing from the published package).
 * This script imports the build output with plain Node.js and renders a built-in template.
 *
 * Sandbox mode does not prevent SMTP connections, so the transporter points at smtp.example.com (reserved domain,
 * never resolves). The send fails at DNS resolution, which only happens once rendering has succeeded: any other
 * error, such as a missing view file, fails the test.
 *
 * Usage: npm run build && node test/node/dist-smoke.mjs
 */
import assert from 'node:assert/strict';

const { Cliam } = await import('../../dist/index.js');

Cliam.configure({
  sandbox: true,
  defaults: {
    addresses: {
      from: { name: 'Cliam', email: 'no-reply@example.com' },
      replyTo: { name: 'Cliam', email: 'no-reply@example.com' },
    },
  },
  transporters: [
    {
      id: 'smtp',
      auth: { username: 'smoke', password: 'smoke-password' },
      options: { host: 'smtp.example.com', port: 587, secure: false },
    },
  ],
});

// No content and no provider template: Cliam renders its own built-in template from src/views.
// Cliam.mail rejects with a SendingError when the transport fails: the rejection is the result under test.
const response = await Cliam.mail('user.welcome', {
  meta: { subject: 'Smoke', to: [{ email: 'smoke@example.com', name: 'Smoke' }] },
  data: { username: 'Smoke' },
}).catch((error) => error);

assert.ok(response, 'Cliam.mail returned nothing');
assert.equal(response.code, undefined, `Rendering failed before sending: ${response.message ?? ''}`);
assert.match(
  JSON.stringify(response.errors ?? []),
  /ENOTFOUND|EAI_AGAIN/,
  `Expected a DNS failure after rendering, got: ${JSON.stringify(response)}`,
);

console.log('dist smoke test OK');
