module.exports = {
  "name": "sparkpost",
  "credentials": {
    "apiKey": process.env.SPARKPOST_API_KEY
  },
  "templates" : {
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