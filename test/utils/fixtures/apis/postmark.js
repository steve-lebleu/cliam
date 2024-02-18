module.exports = {
  "name": "postmark",
  "credentials": {
    "apiKey": process.env.POSTMARK_API_KEY
  },
  "templates" : {
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