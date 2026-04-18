# Roadmap

## Phase 1 — Public API surface ✅

The contract must be settled before the internals move.

- **Type exports.** Export all public interfaces and types from `index.ts` so consumers can import and use them in their own TypeScript projects without workarounds.
- **Slim `IPayload`.** The current interface is too fat and produces poor DX. `renderEngine` is an internal concern — remove it from the public API and infer it from context: use `provider` engine when a template ID is configured for the event, use `self` when `content` is provided, fall back to `cliam`. `meta.templateId` is already marked deprecated — remove it.
- **Explicit initialisation.** The explicit `private static instance` + `static get()` singleton pattern is redundant in a module system — the module cache already guarantees a single instance. The real problem is that `container.service.ts` calls `Container.get()` at the bottom of the file and exports the result, meaning side effects (reading `.cliamrc.js`, validating config, calling `process.exit()`) fire at import time and freeze state permanently. The fix is to separate import from initialisation: `Cliam.configure(config)` accepts a plain object, `Cliam.configureFromFile(path?)` loads from a `.js` file (defaulting to `.cliamrc.js`). Remove all `process.exit()` calls — throw typed errors instead.
- **`.cliamrc.js` clarity.** Document precisely which fields come from the config file vs environment variables. Dotenv is the caller's responsibility, not the library's.
- **`build` script.** Add a `build` script to `package.json` (`tsc`). The `dist/` folder must not need to be committed.

## Phase 2 — ESM migration and tooling

ESM first so the HTTP rewrites in Phase 3 land cleanly in a native ESM codebase.

- **Migrate to ESM.** Convert the project to native ES modules. Target Node 18+.
- **Switch build tool to `tsup`.** Replace `tsc` as the build tool with `tsup` (esbuild-based). This eliminates the need for explicit `.js` extensions on relative imports, enables TypeScript path aliases at runtime, and produces clean ESM output. The `build` script becomes `tsup`. Use `"moduleResolution": "Bundler"` in `tsconfig.json` to match.
- **Add TypeScript path aliases.** Use `@/*` → `src/*` so imports read `@/services/container` instead of relative paths. `tsup` resolves these at build time with no post-processing needed.
- **Drop `dynamic require()` in `TransporterFactory`.** Replace the switch/require pattern with static imports resolved at configuration time.
- **Optional provider loading.** Expose providers as named exports so consumers can import only what they use. Bundlers can then tree-shake the rest. This also makes it straightforward to add new providers without touching the core.
- **Migrate to Biome.** Replace ESLint and its plugin chain (`eslint-plugin-import`, `eslint-plugin-jsdoc`, `eslint-plugin-prefer-arrow`) plus any Prettier config with a single `biome.json`. One tool handles linting and formatting, faster and with zero plugin maintenance overhead.
- **Adopt Bun in the dev environment.** Bun handles TypeScript natively (no separate compile step to run tests), ships a fast test runner, and aligns naturally with the ESM migration. Bun stays strictly in `devDependencies` — the published package must remain Node 18+ compatible. Consumers on Node must never need to know Bun was involved.

## Phase 3 — Dependency and security overhaul

With a clean ESM codebase in place, the HTTP rewrites land without CJS/ESM friction.

The core problem: every `nodemailer-*` transporter package is a thin HTTP wrapper around a provider REST API. Several are effectively abandoned and carry unpatched vulnerabilities that propagate to every consumer of cliam.

- **Wrap `ky` as the shared HTTP client.** `ky` is fetch-based, ESM-native, lightweight (~3kb), and has retry built-in. All provider implementations go through a single internal HTTP client wrapper — the underlying lib is a one-file concern.
- **Remove all `nodemailer-*` provider packages.** Replace each with a direct HTTP implementation using the shared `ky` wrapper. Each provider becomes a self-contained module inside `src/transporters/<provider>/` that owns its own request building, response normalisation, and error mapping. No external runtime dependency for web API providers.
- **Keep `nodemailer` for SMTP only.** SMTP genuinely warrants nodemailer: TLS, STARTTLS, connection pooling, and auth negotiation are non-trivial. All other providers need only `ky`.
- **Merge `sendinblue` and `brevo`.** They are the same provider post-rebrand. Keep `brevo`, add `sendinblue` as a deprecated alias that logs a warning.
- **Audit and drop transitive dependencies.** Once the nodemailer transport packages are gone, audit what remains and drop anything not actively maintained or replaceable with a few lines of code.

## Phase 4 — Source structure refactor

The current layout conflates unrelated concerns under weak folder names.

- **Dissolve `classes/`.** The folder groups four unrelated things: the public entry point (`Cliam`), a config shape (`ClientConfiguration`), and two value objects (`SendingResponse`, `SendingError`). Move `SendingResponse` and `SendingError` to `types/`, inline `ClientConfiguration` into `types/interfaces/`, and let `Cliam` stand alone or move into a top-level `core/` if a grouping is still wanted.
- **Move Joi schemas out of `types/`.** `types/schemas/` holds runtime validation logic, not type definitions. Merge into `validations/` where the other schemas already live.
- **Rehome the orphaned decorator.** `types/decorators/debug.decorator.ts` is a single file with no natural parent. Move it to `utils/` or drop it if unused.
- **Rename the inner `types/types/` folder.** The `types/types/` nesting is redundant. Rename to `types/aliases/` or fold the type aliases directly into `types/interfaces/` where they are derived types of existing interfaces.

## Phase 5 — Polish and new features

With a clean foundation in place.

- **New providers.** The direct HTTP approach makes adding providers cheap. Candidates: Resend, Amazon SES (native, replacing the abandoned `nodemailer-ses-transport`).
