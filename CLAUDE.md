# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests
npm test

# Run tests with lcov coverage (CI)
npm run ci:test

# Run a single test file (mocha directly)
./node_modules/.bin/mocha ./test/00-bootstrap.test.js --exit --reporter spec --timeout 5000 --env test

# Compile TypeScript
npm run build

# Generate TypeDoc documentation
npm run doc:typedoc
```

Tests are written in JavaScript (Mocha/Chai/Sinon) and live in `test/`. The bootstrap file (`test/00-bootstrap.test.js`) copies `test/fixtures/cliamrc.js` to `.cliamrc.js` before running the suite — a `.cliamrc.js` at project root is required at runtime.

## Architecture

Cliam is a TypeScript library that provides a unified interface for sending transactional emails via multiple providers (SMTP or web API). It is distributed as a compiled CommonJS package (`dist/`).

**Core flow:**

1. **`Container` service** (`src/services/container.service.ts`) — singleton that reads and validates `.cliamrc.js` on startup using Joi schemas, then instantiates all configured transporters via `TransporterFactory`.

2. **`TransporterFactory`** (`src/transporters/transporter.factory.ts`) — factory that returns a concrete `Transporter` subclass for each configured provider (brevo, mailersend, mailgun, mailjet, mandrill, postmark, sendgrid, sendinblue, sparkpost, or plain SMTP). Each provider lives under `src/transporters/<provider>/`.

3. **Abstract `Transporter`** (`src/transporters/transporter.class.ts`) — base class that all provider implementations extend. Subclasses override `build()` (maps `IMail` → provider-specific payload), `error()` (normalizes errors into `SendingError`), and `response()` (normalizes success into `SendingResponse`).

4. **`Mailer` service** (`src/services/mailer.service.ts`) — orchestrates a single send: resolves the render engine, validates the payload, calls `transporter.build()` then `transporter.send()`.

5. **`RenderEngine` service** (`src/services/render-engine.service.ts`) — Handlebars-based engine. Three render modes:
   - `cliam` — uses bundled `.hbs` templates (`src/views/`) with optional theme color substitution
   - `self` — caller supplies raw HTML/text content
   - `provider` — delegates rendering to the provider's template system (template ID from cliamrc)

6. **`Cliam` class** (`src/classes/cliam.class.ts`) — exported as the singleton `Cliam`. Exposes a single `mail(event, payload)` method. Routes to the correct `Mailer` by `payload.transporterId` (defaults to the first configured transporter).

**Key types:**
- `IPayload` — the public API input: `meta` (addresses, subject), `content` (raw buffers), `data` (template variables), optional `transporterId`, `renderEngine`
- `IMail` — internal representation after render engine selection, passed to `transporter.build()`
- `SendingResponse` / `SendingError` — normalized output regardless of provider

**Configuration (`.cliamrc.js`):**
- `sandbox: boolean` — suppresses actual sends when true
- `variables` — default `from`/`replyTo` addresses and `domain`
- `placeholders` — company branding and theme colors used by the cliam render engine
- `transporters[]` — array with `id`, optional `provider`, `auth`, optional `options` (SMTP), optional `templates` (event → provider template ID map)

**Built-in template events** (usable with `renderEngine: 'cliam'`): `default`, `event.subscribe`, `event.unsubscribe`, `event.updated`, `order.invoice`, `order.progress`, `order.shipped`, `password.request`, `password.updated`, `user.invite`, `user.contact`, `user.progress`, `user.survey`, `user.welcome`, `user.bye`, `user.confirm`.
