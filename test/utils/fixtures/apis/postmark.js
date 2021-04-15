module.exports = {
  "name": "postmark",
  "credentials": {
    "apiKey": process.env.POSTMARK_API_KEY
  },
  "templates" : {
    "default": "13124851",
    "event.subscribe": "13124851",
    "event.unsubscribe": "13124851",
    "event.updated": "13124851",
    "user.bye": "13124851",
    "user.confirm": "13124851",
    "user.contact": "13124851",
    "user.invite": "13124851",
    "user.progress": "13124851",
    "user.survey": "13124851",
    "user.welcome": "13124851",
    "order.invoice": "13124851",
    "order.progress": "13124851",
    "order.shipped": "13124851",
    "password.request": "13124851",
    "password.updated": "13124851"
  }
}