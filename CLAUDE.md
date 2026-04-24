# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests
bun test test/

# Run a single test file
bun test test/04-transporters.test.ts

# Type-check without emitting
npm run typecheck

# Compile TypeScript (via tsup)
npm run build

# Lint or lint+format
npm run lint
npm run check

# Generate TypeDoc documentation
npm run doc:typedoc
```

Tests are written in TypeScript (Bun test runner, Chai, Sinon) and live in `test/`. `test/setup.ts` calls `Cliam.configureFromFile()` pointing at `test/fixtures/cliamrc.js` — that fixture is the test configuration and must stay in sync with any changes to the config schema.

## Architecture

Cliam is a TypeScript ESM library providing a unified interface for sending transactional emails via multiple providers (SMTP or web API). Distributed as an ESM package (`dist/`) built with tsup.

**Core flow:**

1. **`Container` service** (`src/services/container.service.ts`) — singleton that reads and validates `.cliamrc.js` on startup using Joi schemas, then instantiates all configured transporters via the transporter registry.

2. **Transporter registry** (`src/transporters/transporter.registry.ts`) — each provider's `index.ts` calls `registerTransporter(PROVIDER.x, factory)` at import time. `TransporterFactory` (`src/transporters/transporter.factory.ts`) calls the registered factory to instantiate the concrete class.

3. **Abstract `Transporter`** (`src/transporters/transporter.class.ts`) — base class all provider implementations extend. Subclasses override `build()` (maps `IMail` → provider-specific payload), `error()` (normalizes errors into `SendingError`), and `response()` (normalizes success into `SendingResponse`). HTTP-based providers extend `HttpTransporter` which wraps `HttpClient` (`src/services/http.service.ts`, based on `ky`).

4. **`Mailer` service** (`src/services/mailer.service.ts`) — orchestrates a single send: resolves the render engine, validates the payload, calls `transporter.build()` then `transporter.send()`.

5. **`RenderEngine` service** (`src/services/render-engine.service.ts`) — Handlebars-based engine. Three render modes:
   - `cliam` — uses bundled `.hbs` templates (`src/views/`) with theme colors injected as HBS variables (`primaryColor`, `secondaryColor`, etc.) from `placeholders` config
   - `self` — caller supplies raw HTML/text content
   - `provider` — delegates rendering to the provider's template system (template ID from cliamrc)

6. **`Cliam` class** (`src/classes/cliam.class.ts`) — exported singleton. Exposes `mail(event, payload)`. Routes to the correct `Mailer` by `payload.transporterId` (defaults to the first configured transporter).

**Key types:**
- `IPayload` — public API input: `meta` (addresses, subject), `content` (raw buffers), `data` (template variables), optional `transporterId`, `renderEngine`
- `IMail` — internal representation after render engine resolution; `meta.from` and `meta.replyTo` are required (narrowed via `ResolvedMeta`)
- `SendingResponse` / `SendingError` — normalized output regardless of provider

**Configuration (`.cliamrc.js`):**
- `sandbox: boolean` — suppresses actual sends when true
- `variables` — default `from`/`replyTo` addresses and `domain`
- `placeholders` — company branding and theme colors used by the cliam render engine
- `transporters[]` — array with `id`, `provider`, `auth`, optional `options` (SMTP only), optional `templates` (event → provider template ID map)

**Providers:** `brevo`, `mailersend`, `mailgun`, `mailjet`, `mandrill`, `postmark`, `resend`, `sendgrid`, `sparkpost`, `smtp`

**Built-in template events** (usable with `renderEngine: 'cliam'`): `default`, `event.subscribe`, `event.unsubscribe`, `event.updated`, `order.invoice`, `order.progress`, `order.shipped`, `password.request`, `password.updated`, `user.invite`, `user.contact`, `user.progress`, `user.survey`, `user.welcome`, `user.bye`, `user.confirm`.

## TypeScript setup

- TS 6 with TC39 Stage 3 decorators (no `experimentalDecorators`)
- `moduleResolution: Bundler`, `module: ESNext`, `target: ES2022`
- `skipLibCheck: true` — needed due to `@types/node` v20 incompatibilities with TS 6
- `ignoreDeprecations: "6.0"` — for `baseUrl` path alias support
- Path aliases (`@/*`, `@core/*`, `@services/*`, etc.) are tsup-resolved at build time
