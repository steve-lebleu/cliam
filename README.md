![Cliam](https://cdn.konfer.be/images/cliam/assets/banner-cliam.png)

![Github action workflow status](https://github.com/steve-lebleu/cliam/actions/workflows/build.yml/badge.svg?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/cliam/badge.svg?branch=main)](https://coveralls.io/github/steve-lebleu/cliam?branch=main)
[![CodeFactor](https://www.codefactor.io/repository/github/steve-lebleu/cliam/badge)](https://www.codefactor.io/repository/github/steve-lebleu/cliam)
![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/cliam?logo=Github)
[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://opensource.org/licenses/gpl-license.php)

# Transactional emails with a kick

Agnostic transactional email sending in Node.js environment :boom: :muscle: :pill:

## > Why ?

To improve and facilitate the implementation, flexibility and maintenance of transactional emailing tasks.

## > Features

- Agnostic transactional email sending using web API or SMTP server. One [input](https://github.com/steve-lebleu/cliam/wiki/Inputs), one [output](https://github.com/steve-lebleu/cliam/wiki/Outputs).
- Multiple simultaneous transporters.
- [Configuration](https://github.com/steve-lebleu/cliam/wiki/Configuration) based, not implementation based : easy switch between different modes.
- Normalized [transactions events](https://github.com/steve-lebleu/cliam/wiki/Transactions).
- Securized payloads.
- Customisable default templates.

## > Table of contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Beneficiary use cases](#beneficiary-use-cases)
- [Supported web API providers](#supported-web-api-providers)
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

Create a *.cliamrc.js* module on the root of your project.

```shell
> touch .cliamrc.js
```

Define a minimalist configuration in *.cliamrc.js* newly created:

```javascript
module.exports = {
  "sandbox": true,
  "transporters": [
    {
      "id": "unique-transporter-key",
      "mode": "smtp",
      "auth": {
        "username": "USERNAME",
        "password": "PASSWORD"
      },
      "options": {
        "host": "HOST",
        "port": 587,
        "secure": false
      }
    },
    {
      "id": "other-unique-transporter-key",
      "mode": "api",
      "provider": "sendgrid",
      "auth": {
        "apiKey": "APIKEY",
      },
      "options": {
        "templates": {
          "user.welcome": "d-321bb40f548e4db8a628b4d6464ebacc"
        }
      }
    }
  ]
}
```

See [configuration](https://github.com/steve-lebleu/cliam/wiki/Configuration) wiki section for more information about availables options and configurations.

### Implement

```javascript
import { Cliam } from 'cliam';

// Do some stuffs ...
  
const payload = {
  meta: {
    from: { email: 'john.doe@hotmail.com' },
    to: [
      { email: 'john.allan.poe@hotmail.com' }
    ],
    replyTo: { email: 'john.doe@hotmail.com' },
    subject: 'Welcome John'
  }
  content: [
    {
      type: 'text/html',
      value: '<h1>Hello Yoda</h1><p>I use Cliam to send my emails !</p>'
    }
  ]
};

Cliam.mail('user.welcome', payload)
  .then(res => {
    console.log('Email has been delivered: ', res);
  })
  .catch(err => {
    console.log('Error while mail sending: ', err)
  });
```

By default, Cliam will use the first transporter found in the cliamrc file, except if you precise wich transporterId you want to use on the fly.

See [request payload](https://github.com/steve-lebleu/cliam/wiki/Inputs) wiki section for more information about availables options and configurations.

<h2 id="beneficiary-use-cases">> Beneficiary use cases</h2>

**:white_check_mark: I have many projects which uses differents providers, it's a hell of a thing to maintain.**

This is to be forgotten with Cliam. No more worries about polymorphics inputs / outputs. Whether you are working with an A, B, C, D provider or a smtp server, your input / output will always be the same regardless of your delivery method or service provider.

**:white_check_mark: I wish change from supplier, but I'm in panic about the implementation ?**

Your implementation does not move, you just have to adapt a configuration file, remove your legacy code and implement some lines of code. 

**:white_check_mark: I don't have a subscription to a supplier, and no templates**

No problem, we have all been poor once. Start with a simple SMTP server and use default templates. When your business is up, you can use a paid web api.

**:white_check_mark: I did not have time to prepare the template for an important email that should be send today !**

No more, you can fallback easily with a one shot default template.

**:white_check_mark: I have a big problem with a provider, and my emails stay blocked in the pipe !**

The same: fallback on a SMTP server. In two minutes you're ready and your mailing is back in operation.

<h2 id="supported-web-api-providers">> Supported web API providers</h2>

<p>
  <a href="https://sendgrid.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/sendgrid.png" alt="Sendgrid" width="240px" hspace="15" /></a>
  <a href="https://mailgun.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mailgun.png" alt="Mailgun" width="240px" hspace="15" /></a>
  <a href="https://sparkpost.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/sparkpost.png" alt="Sparkpost" width="240px" hspace="15" /></a>
</p>

<p>
  <a href="https://postmarkapp.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/postmark.png" alt="Postmark" width="240px" hspace="15" /></a>
  <a href="https://mailjet.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mailjet.png" alt="Mailjet" width="240px" hspace="15" /></a>
  <a href="https://www.sendinblue.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/sendinblue.png" alt="Sendinblue" width="240px" hspace="15" /></a>
</p>

<p>
  <a href="https://brevo.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/brevo.png" alt="Brevo" width="240px" hspace="15" /></a>
  <a href="https://app.mailersend.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mailersend.png" alt="Mailersend" width="240px" hspace="15" /></a>
  <a href="https://mandrillapp.com/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/mandrill.png" alt="Mandrill" width="240px" hspace="15" /></a>
</p>

<!--
<p>
  <a href="https://aws.amazon.com/fr/ses/" target="_blank"><img src="https://cdn.konfer.be/images/cliam/providers/amazon-ses.png" alt="Amazon SES" width="240px" hspace="15" /></a>
</p>
-->

<h2 id="licence">> Licence</h2>

[AGPL-3.0 License](https://github.com/steve-lebleu/cliam/blob/main/LICENSE)
