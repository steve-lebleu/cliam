![Cliam](https://cdn.konfer.be/images/cliam/assets/banner-cliam.png)

[![Node](https://img.shields.io/badge/Node-18.19.0-informational?logo=node.js&color=43853D)](https://nodejs.org/docs/latest-v18.x/api/index.html)
[![TypeScript](https://img.shields.io/badge/Typescript-6.0.3-informational?logo=typescript&color=2F74C0)](https://www.typescriptlang.org/)

![Github action workflow status](https://github.com/steve-lebleu/cliam/actions/workflows/build.yml/badge.svg?branch=main)
![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/cliam?logo=Github)
[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://opensource.org/licenses/gpl-license.php)

[![Maintainability](https://qlty.sh/badges/b81700b3-a1e1-45ed-8475-9bbdfe1ab0ae/maintainability.svg)](https://qlty.sh/gh/steve-lebleu/projects/cliam)
[![Code Coverage](https://qlty.sh/badges/b81700b3-a1e1-45ed-8475-9bbdfe1ab0ae/coverage.svg)](https://qlty.sh/gh/steve-lebleu/projects/cliam)

# Transactional emails with a kick

Agnostic transactional email sending in Node.js environment

## > Why ?

To improve and facilitate the implementation, the flexibility and the maintenance of transactional emailing tasks.

## > Features

- Agnostic transactional email sending using web API or SMTP server. One [input](https://github.com/steve-lebleu/cliam/wiki/Email-payload), one [output](https://github.com/steve-lebleu/cliam/wiki/Email-response).
- Multiple simultaneous transporters.
- [Configuration](https://github.com/steve-lebleu/cliam/wiki/Configuration-with-cliamrc.js) based, not implementation based : easy switch between different modes.
- Normalized [transactions events](https://github.com/steve-lebleu/cliam/wiki/Transactions).
- Securized payloads.
- Customisable default templates.

## > Table of contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Selective imports](#selective-imports)
- [Beneficiary use cases](#beneficiary-use-cases)
- [Supported web API providers](#supported-web-api-providers)
- [Upgrading to v3](#upgrading-to-v3)
- [Licence](#licence)
- [Documentation](https://github.com/steve-lebleu/cliam/wiki)

<h2 id="requirements">> Requirements</h2>

- Node.js >= 18.19.0
- NPM >= 10.2.3

<h2 id="getting-started">> Getting started</h2>

### Install

```shell
> npm i cliam --save
```

### Configure

Cliam must be configured once at application startup, before any call to `mail()`. Two approaches are available.

**Option A - Pass a configuration object directly:**

```typescript
import { Cliam } from 'cliam';
import type { IClientConfiguration } from 'cliam';

const config: IClientConfiguration = {
  sandbox: true,
  variables: {
    domain: 'https://www.my-website.com',
    addresses: {
      from: { name: 'My App', email: 'no-reply@my-website.com' },
      replyTo: { name: 'My App', email: 'no-reply@my-website.com' }
    }
  },
  transporters: [
    {
      id: 'smtp-main',
      auth: {
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD
      },
      options: {
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false
      }
    },
    {
      id: 'sendgrid-api',
      provider: 'sendgrid',
      auth: {
        apiKey: process.env.SENDGRID_API_KEY
      },
      templates: {
        'user.welcome': 'd-321bb40f548e4db8a628b4d6464ebacc'
      }
    }
  ]
};

Cliam.configure(config);
```

**Option B - Load from a `.cliamrc.js` file:**

```typescript
import { Cliam } from 'cliam';

// Loads .cliamrc.js from process.cwd() by default
Cliam.configureFromFile();

// Or pass an explicit path
Cliam.configureFromFile('/path/to/my-cliam-config.js');
```

The `.cliamrc.js` file should export the same configuration object as above:

```javascript
require('dotenv').config();

module.exports = {
  sandbox: true,
  variables: {
    domain: 'https://www.my-website.com',
    addresses: {
      from: { name: 'My App', email: 'no-reply@my-website.com' },
      replyTo: { name: 'My App', email: 'no-reply@my-website.com' }
    }
  },
  transporters: [ ... ]
};
```

Use environment variables for sensitive values such as API keys. Cliam does not load `.env` automatically — that is the responsibility of the calling application.

See [cliamrc configuration](https://github.com/steve-lebleu/cliam/wiki/Configuration-with-cliamrc.js) wiki section for the full list of available options.

### Selective imports

The default entry point registers all supported providers at import time:

```typescript
import { Cliam } from 'cliam'; // all providers loaded
```

If you use a bundler and want to reduce your bundle size, import the core and load only the providers you actually use:

```typescript
import { Cliam } from 'cliam/core';
import 'cliam/providers/sendgrid';
// import 'cliam/providers/smtp'; // add others as needed
```

Types and enums are available separately:

```typescript
import type { IPayload, IClientConfiguration } from 'cliam/types';
import { EVENT, PROVIDER } from 'cliam/types';
```

Available sub-paths:

| Sub-path | Exports |
|---|---|
| `cliam` | `Cliam`, `SendingResponse`, `SendingError`, all types — registers all providers |
| `cliam/core` | `Cliam`, `SendingResponse`, `SendingError` — no providers registered |
| `cliam/types` | All interfaces, enums and types — no runtime code |
| `cliam/providers/brevo` | Side-effect: registers the Brevo transporter |
| `cliam/providers/mailersend` | Side-effect: registers the Mailersend transporter |
| `cliam/providers/mailgun` | Side-effect: registers the Mailgun transporter |
| `cliam/providers/mailjet` | Side-effect: registers the Mailjet transporter |
| `cliam/providers/mandrill` | Side-effect: registers the Mandrill transporter |
| `cliam/providers/postmark` | Side-effect: registers the Postmark transporter |
| `cliam/providers/resend` | Side-effect: registers the Resend transporter |
| `cliam/providers/sendgrid` | Side-effect: registers the Sendgrid transporter |
| `cliam/providers/ses` | Side-effect: registers the Amazon SES transporter |
| `cliam/providers/sparkpost` | Side-effect: registers the Sparkpost transporter |
| `cliam/providers/smtp` | Side-effect: registers the SMTP transporter |

If a transporter is configured but its provider was never imported, Cliam throws at send time with a clear message.

### Implement

```typescript
import { Cliam } from 'cliam';
import type { IPayload } from 'cliam';

const payload: IPayload = {
  meta: {
    from: { email: 'john.doe@hotmail.com', name: 'John Doe' },
    to: [{ email: 'john.allan.poe@hotmail.com' }],
    replyTo: { email: 'john.doe@hotmail.com', name: 'John Doe' },
    subject: 'Welcome John'
  },
  content: [
    {
      type: 'text/html',
      value: '<h1>Hello Yoda</h1><p>I use Cliam to send my emails !</p>'
    }
  ]
};

Cliam.mail('user.welcome', payload)
  .then(res => {
    console.log('Email delivered: ', res);
  })
  .catch(err => {
    console.log('Error: ', err);
  });
```

The render engine is inferred automatically:
- `content` provided → uses your HTML directly
- No `content`, template ID configured for the event → delegates to the provider's template engine
- No `content`, no template → uses Cliam's built-in default templates

By default, Cliam uses the first transporter in the configuration. Pass `transporterId` in the payload to target a specific one.

See [email payload](https://github.com/steve-lebleu/cliam/wiki/Email-payload) wiki section for the full payload reference.

<h2 id="beneficiary-use-cases">> Beneficiary use cases</h2>

**:white_check_mark: I have many projects which uses differents providers, it's a hell of a thing to maintain.**

This is to be forgotten with Cliam. No more worries about polymorphics inputs / outputs. Whether you are working with an A, B, C, D provider or a smtp server, your input / output will always be the same regardless of your delivery method or service provider.

**:white_check_mark: I'm just using many providers into a same project, it's convoluted to securize and maintain.**

Same purpose. Whether you are working with a provider or a SMTP server - or boths, your input / output stays the same. With Cliam, you don't need anymore to embedd n libraries into your `node_modules` folder: we only embed `nodemailer` core library to send emails through SMTP and `ky` as HTTP client.

**:white_check_mark: I wish change from supplier, but I'm in panic about the implementation ?**

Your implementation does not move, you just have to adapt a configuration file, remove your legacy code and implement some lines of code. 

**:white_check_mark: I don't have a subscription to a supplier, and no templates**

No problem, we have all been poor once. Start with a simple SMTP server and use default templates. When your business is up, you can use a paid web api.

**:white_check_mark: I did not have time to prepare the template for an important email that should be send today !**

No more, you can fallback easily with a one shot default template.

**:white_check_mark: I have a big problem with a provider, and my emails stay blocked in the pipe !**

The same: fallback on a SMTP server. In two minutes you're ready and your mailing is back in operation.

<h2 id="supported-web-api-providers">> Supported web API providers</h2>

<table>
    <tr align="center">
        <td valign="middle"><a href="https://www.resend.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/resend.png" alt="Resend" width="320px" hspace="15" /></a></td>
        <td valign="middle"><a href="https://sparkpost.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/sparkpost.png" alt="Sparkpost" width="320px" hspace="15" /></a></td>
    </tr>
    <tr align="center">
        <td valign="middle"><a href="https://sendgrid.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/sendgrid.png" alt="Sendgrid" width="320px" hspace="15" /></a></td>
        <td valign="middle"><a href="https://postmarkapp.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/postmark.png" alt="Postmark" width="320px" hspace="15" /></a></td>
    </tr>
    <tr align="center">
        <td valign="middle"><a href="https://app.mailersend.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mailersend.png" alt="Mailersend" width="320px" hspace="15" /></a></td>
        <td valign="middle"><a href="https://mailgun.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mailgun.png" alt="Mailgun" width="320px" hspace="15" /></a></td>
    </tr>
    <tr align="center">
        <td valign="middle"><a href="https://mailjet.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mailjet.png" alt="Mailjet" width="320px" hspace="15" /></a></td>
        <td valign="middle"><a href="https://brevo.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/brevo.png" alt="Brevo" width="320px" hspace="15" /></a></td>
    </tr>
    <tr align="center">
        <td valign="middle"><a href="https://mandrillapp.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mandrill.png" alt="Mandrill" width="320px" hspace="15" /></a></td>
        <td valign="middle"><a href="https://aws.amazon.com/fr/ses/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/amazon-ses.png" alt="Amazon SES" width="320px" hspace="15" /></a></td>
    </tr>
</table>

<h2 id="upgrading-to-v3">> Upgrading to v3</h2>

### What's new

- **Resend** is now a supported provider (`cliam/providers/resend`, `provider: 'resend'`).

### Breaking changes

**`inlineImages` removed from `IPayload`**

The `inlineImages` field no longer exists. Inline images must be passed as attachments via the `content` array.

**`sendinblue` provider removed**

`sendinblue` has been removed — it was already an alias for `brevo`. Update your configuration:

```diff
- provider: 'sendinblue'
+ provider: 'brevo'
```

and update any selective import:

```diff
- import 'cliam/providers/sendinblue';
+ import 'cliam/providers/brevo';
```

<h2 id="licence">> Licence</h2>

[AGPL-3.0 License](https://github.com/steve-lebleu/cliam/blob/main/LICENSE)
