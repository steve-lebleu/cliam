module.exports = {
  "name": "sendinblue",
  "credentials": {
    "apiKey": process.env.SENDINBLUE_API_KEY
  },
  "templates" : {
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