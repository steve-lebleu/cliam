module.exports = {
  "sandbox": true,
  "variables": {
    "domain": "https://www.my-website.com",
    "addresses": {
      "from": {
        "name": "John Doe",
        "email": "info@john.doe.com"
      },
      "replyTo": {
        "name": "John Doe",
        "email": "info@john.doe.com"
      }
    }
  },
  "placeholders": {
    "company": {
      "name": "My Company",
      "url": "https://www.my-website.com",
      "location": {
        "street": "Baker street",
        "num": "221B",
        "zip": "NW1 6XE",
        "city": "Marylebone",
        "country": "United Kingdom"
      },
      "email": "contact@john-doe.com",
      "phone": "+44 20 7224 3688",
      "socials": [
        { "name": "github", "url": "https://github.com/steve-lebleu/cliam" }
      ]
    },
    "theme": {
      "logo": "https://cdn.konfer.be/images/cliam/assets/logo-cliam.png",
      "primaryColor": "5bd1d7",
      "secondaryColor": "348498",
      "tertiaryColor": "004d61",
      "quaternaryColor": "ff502f"
    }
  },
  "transporters": [
    {
      "id": "mailjet-api",
      "mode": "api",
      "provider": "mailjet",
      "auth": {
        "apiKey": process.env.MAILJET_API_KEY,
        "apiSecret": process.env.MAILJET_TOKEN,
      },
      "options": {
        "templates": {
          "default": "953274",
          "event.subscribe": "953274",
          "event.unsubscribe": "953274",
          "event.updated": "953274",
          "user.bye": "953274",
          "user.confirm": "953274",
          "user.contact": "953274",
          "user.invite": "953274",
          "user.progress": "953274",
          "user.survey": "953274",
          "user.welcome": "5704402",
          "order.invoice": "953274",
          "order.progress": "953274",
          "order.shipped": "953274",
          "password.request": "953274",
          "password.updated": "953274"
        }
      }
    },
    {
      "id": "postmark-api",
      "mode": "api",
      "provider": "postmark",
      "auth": {
        "apiKey": process.env.POSTMARK_API_KEY,
      },
      "options": {
        "templates": {
          "default": "23106974",
          "event.subscribe": "23106974",
          "event.unsubscribe": "23106974",
          "event.updated": "23106974",
          "user.bye": "23106974",
          "user.confirm": "23106974",
          "user.contact": "23106974",
          "user.invite": "23106974",
          "user.progress": "23106974",
          "user.survey": "23106974",
          "user.welcome": "23106974",
          "order.invoice": "23106974",
          "order.progress": "23106974",
          "order.shipped": "23106974",
          "password.request": "23106974",
          "password.updated": "23106974"
        }
      }
    },
    {
      "id": "brevo-api",
      "mode": "api",
      "provider": "brevo",
      "auth": {
        "apiKey": process.env.BREVO_API_KEY,
      },
      "options": {
        "templates": {
          "default": "1",
          "event.subscribe": "1",
          "event.unsubscribe": "1",
          "event.updated": "1",
          "user.bye": "1",
          "user.confirm": "1",
          "user.contact": "1",
          "user.invite": "1",
          "user.progress": "1",
          "user.survey": "1",
          "user.welcome": "1",
          "order.invoice": "1",
          "order.progress": "1",
          "order.shipped": "1",
          "password.request": "1",
          "password.updated": "1"
        }
      }
    },
    {
      "id": "sendinblue-api",
      "mode": "api",
      "provider": "sendinblue",
      "auth": {
        "apiKey": process.env.SENDINBLUE_API_KEY,
      },
      "options": {
        "templates": {
          "default": "1",
          "event.subscribe": "1",
          "event.unsubscribe": "1",
          "event.updated": "1",
          "user.bye": "1",
          "user.confirm": "1",
          "user.contact": "1",
          "user.invite": "1",
          "user.progress": "1",
          "user.survey": "1",
          "user.welcome": "1",
          "order.invoice": "1",
          "order.progress": "1",
          "order.shipped": "1",
          "password.request": "1",
          "password.updated": "1"
        }
      }
    },
    {
      "id": "sendgrid-api",
      "mode": "api",
      "provider": "sendgrid",
      "auth": {
        "apiKey": process.env.SENDGRID_API_KEY,
      },
      "options": {
        "templates": {
          "default": "d-321bb40f548e4db8a628b4d6464ebacc",
          "event.subscribe": "d-321bb40f548e4db8a628b4d6464ebacc",
          "event.unsubscribe": "d-321bb40f548e4db8a628b4d6464ebacc",
          "event.updated": "d-321bb40f548e4db8a628b4d6464ebacc",
          "user.bye": "d-321bb40f548e4db8a628b4d6464ebacc",
          "user.confirm": "d-321bb40f548e4db8a628b4d6464ebacc",
          "user.contact": "d-321bb40f548e4db8a628b4d6464ebacc",
          "user.invite": "d-321bb40f548e4db8a628b4d6464ebacc",
          "user.progress": "d-321bb40f548e4db8a628b4d6464ebacc",
          "user.survey": "d-321bb40f548e4db8a628b4d6464ebacc",
          "user.welcome": "d-321bb40f548e4db8a628b4d6464ebacc",
          "order.invoice": "d-321bb40f548e4db8a628b4d6464ebacc",
          "order.progress": "d-321bb40f548e4db8a628b4d6464ebacc",
          "order.shipped": "d-321bb40f548e4db8a628b4d6464ebacc",
          "password.request": "d-321bb40f548e4db8a628b4d6464ebacc",
          "password.updated": "d-321bb40f548e4db8a628b4d6464ebacc"
        }
      }
    },
    {
      "id": "mailgun-api",
      "mode": "api",
      "provider": "mailgun",
      "auth": {
        "apiKey": process.env.MAILGUN_API_KEY,
      },
      "options": {
        "templates": {
          "default": "welcome",
          "event.subscribe": "welcome",
          "event.unsubscribe": "welcome",
          "event.updated": "welcome",
          "user.bye": "welcome",
          "user.confirm": "welcome",
          "user.contact": "welcome",
          "user.invite": "welcome",
          "user.progress": "welcome",
          "user.survey": "welcome",
          "user.welcome": "welcome",
          "order.invoice": "welcome",
          "order.progress": "welcome",
          "order.shipped": "welcome",
          "password.request": "welcome",
          "password.updated": "welcome"
        }
      }
    },
    {
      "id": "mailersend-api",
      "mode": "api",
      "provider": "mailersend",
      "auth": {
        "apiKey": process.env.MAILERSEND_API_KEY,
      },
      "options": {
        "templates": {
          "default": "0p7kx4xdn18l9yjr",
          "event.subscribe": "0p7kx4xdn18l9yjr",
          "event.unsubscribe": "0p7kx4xdn18l9yjr",
          "event.updated": "0p7kx4xdn18l9yjr",
          "user.bye": "0p7kx4xdn18l9yjr",
          "user.confirm": "0p7kx4xdn18l9yjr",
          "user.contact": "0p7kx4xdn18l9yjr",
          "user.invite": "0p7kx4xdn18l9yjr",
          "user.progress": "0p7kx4xdn18l9yjr",
          "user.survey": "0p7kx4xdn18l9yjr",
          "user.welcome": "0p7kx4xdn18l9yjr",
          "order.invoice": "0p7kx4xdn18l9yjr",
          "order.progress": "0p7kx4xdn18l9yjr",
          "order.shipped": "0p7kx4xdn18l9yjr",
          "password.request": "0p7kx4xdn18l9yjr",
          "password.updated": "0p7kx4xdn18l9yjr"
        }
      }
    },
    {
      "id": "sparkpost-api",
      "mode": "api",
      "provider": "sparkpost",
      "auth": {
        "apiKey": process.env.SPARKPOST_API_KEY,
      },
      "options": {
        "templates": {
          "default": "my-first-email",
          "event.subscribe": "my-first-email",
          "event.unsubscribe": "my-first-email",
          "event.updated": "my-first-email",
          "user.bye": "my-first-email",
          "user.confirm": "my-first-email",
          "user.contact": "my-first-email",
          "user.invite": "my-first-email",
          "user.progress": "my-first-email",
          "user.survey": "my-first-email",
          "user.welcome": "my-first-email",
          "order.invoice": "my-first-email",
          "order.progress": "my-first-email",
          "order.shipped": "my-first-email",
          "password.request": "my-first-email",
          "password.updated": "my-first-email"
        }
      }
    },
    {
      "id": "hosting-smtp",
      "mode": "smtp",
      "auth": {
        "username": process.env.SMTP_USERNAME,
        "password": process.env.SMTP_PASSWORD,
      },
      "options": {
        "host": process.env.SMTP_HOST,
        "port": 587,
        "secure": true,
      }
    },
  ]
}