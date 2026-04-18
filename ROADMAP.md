# Roadmap

## Phase 1 — Public API surface

The contract must be settled before the internals move.

- **Type exports.** Export all public interfaces and types from `index.ts` so consumers can import and use them in their own TypeScript projects without workarounds.
- **Slim `IPayload`.** The current interface is too fat and produces poor DX. `renderEngine` is an internal concern — remove it from the public API and infer it from context: use `provider` engine when a template ID is configured for the event, use `self` when `content` is provided, fall back to `cliam`. `meta.templateId` is already marked deprecated — remove it.
- **Explicit initialisation.** The explicit `private static instance` + `static get()` singleton pattern is redundant in a module system — the module cache already guarantees a single instance. The real problem is that `container.service.ts` calls `Container.get()` at the bottom of the file and exports the result, meaning side effects (reading `.cliamrc.js`, validating config, calling `process.exit()`) fire at import time and freeze state permanently. The fix is to separate import from initialisation: export `configure(config)` and `getContainer()` functions instead, so the host application controls when initialisation happens and can handle errors itself. Remove all `process.exit()` calls — throw typed errors instead.
- **`.cliamrc.js` clarity.** Document precisely which fields come from the config file vs environment variables. Consider supporting a plain object passed to `configure()` as an alternative to the file, so the config source is the caller's problem, not ours.
- **`build` script.** Add a `build` script to `package.json` (`tsc`). The `dist/` folder must not need to be committed.

## Phase 2 — Dependency and security overhaul

The core problem: every `nodemailer-*` transporter package is a thin HTTP wrapper around a provider REST API. Several are effectively abandoned and carry unpatched vulnerabilities that propagate to every consumer of cliam.

- **Remove all `nodemailer-*` provider packages.** Replace each with a direct HTTP implementation using native `fetch` (Node 18+). Each provider becomes a self-contained module inside `src/transporters/<provider>/` that owns its own request building, response normalisation, and error mapping. No external runtime dependency for web API providers.
- **Keep `nodemailer` for SMTP only.** SMTP genuinely warrants nodemailer: TLS, STARTTLS, connection pooling, and auth negotiation are non-trivial. All other providers need only `fetch`.
- **Merge `sendinblue` and `brevo`.** They are the same provider post-rebrand. Keep `brevo`, add `sendinblue` as a deprecated alias that logs a warning.
- **Audit and drop transitive dependencies.** Once the nodemailer transport packages are gone, audit what remains and drop anything not actively maintained or replaceable with a few lines of code.

## Phase 3 — ESM migration and tree-shaking

Natural consequence of Phase 2: once providers are self-contained HTTP modules with no CommonJS wrapper dependency, the door is open.

- **Migrate to ESM.** Convert the project to native ES modules. Target Node 18+, align with the `fetch` requirement.
- **Optional provider loading.** Expose providers as named exports so consumers can import only what they use. Bundlers can then tree-shake the rest. This also makes it straightforward to add new providers without touching the core.
- **Drop `dynamic require()` in `TransporterFactory`.** Replace the switch/require pattern with static imports resolved at configuration time.

## Phase 4 — Code quality and tooling

- **Migrate to Biome.** Replace ESLint and its plugin chain (`eslint-plugin-import`, `eslint-plugin-jsdoc`, `eslint-plugin-prefer-arrow`) plus any Prettier config with a single `biome.json`. One tool handles linting and formatting, faster and with zero plugin maintenance overhead.
- **Adopt Bun in the dev environment.** Bun handles TypeScript natively (no separate compile step to run tests), ships a fast test runner, and aligns naturally with the ESM migration. Bun stays strictly in `devDependencies` — the published package must remain Node 18+ compatible. Consumers on Node must never need to know Bun was involved.

## Phase 5 — Polish and new features

With a clean foundation in place.

- **Fix theme color substitution.** The current approach of doing a global string replace on hex values (`111111`, `222222`, ...) inside compiled HTML is fragile — any occurrence in a URL, attribute, or inline style will be corrupted. Replace with proper Handlebars variable injection.
- **`inlineImages` in `IPayload`.** Currently declared but not validated and not handled by any transporter. Implement or formally deprecate.
- **New providers.** The direct HTTP approach makes adding providers cheap. Candidates: Resend, Amazon SES (native, replacing the abandoned `nodemailer-ses-transport`).
