module.exports = {
  "name": "mailjet",
  "credentials": {
    "apiKey": process.env.MAILJET_API_KEY,
    "token": process.env.MAILJET_TOKEN
  },
  "templates" : {
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