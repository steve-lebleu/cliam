module.exports = {
  "name": "mailgun",
  "credentials": {
    "apiKey": process.env.MAILGUN_API_KEY
  },
  "templates" : {
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