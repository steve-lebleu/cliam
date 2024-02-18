module.exports = {
  "sandbox": true,
  "consumer": {
    "company": "My Company",
    "domain": "https://www.my-company.com",
    "addresses": {
      "from": {
        "name": "John Doe",
        "email": "info@john.doe.com"
      },
      "replyTo": {
        "name": "John Doe",
        "email": "info@john.doe.com"
      }
    },
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
    ],
    "theme": {
      "logo": "https://cdn.konfer.be/images/cliam/assets/logo-cliam.png",
      "primaryColor": "5bd1d7",
      "secondaryColor": "348498",
      "tertiaryColor": "004d61",
      "quaternaryColor": "ff502f"
    }
  },
  "mode": {
    "smtp": {
      "host": process.env.SMTP_HOST,
      "port": 587,
      "secure": false,
      "username": process.env.SMTP_USERNAME,
      "password": process.env.SMTP_PASSWORD
    }
  }
}