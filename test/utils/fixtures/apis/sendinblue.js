module.exports = {
  "name": "sendinblue",
  "credentials": {
    "apiKey": process.env.SENDINBLUE_API_KEY
  },
  "templates" : {
    "default": "1",
    "event.subscribe": "2",
    "event.unsubscribe": "3",
    "event.updated": "4",
    "user.bye": "5",
    "user.confirm": "6",
    "user.contact": "7",
    "user.invite": "8",
    "user.progress": "9",
    "user.survey": "10",
    "user.welcome": "11",
    "order.invoice": "12",
    "order.progress": "13",
    "order.shipped": "14",
    "password.request": "15",
    "password.updated": "16"
  }
}