module.exports = {
  "name": "sendgrid",
  "credentials": {
    "apiKey": process.env.SENDGRID_API_KEY
  },
  "templates" : {
    "default": "d-cf5e5140285644998172dc46d7da9121",
    "event.subscribe": "d-cf5e5140285644998172dc46d7da9121",
    "event.unsubscribe": "d-cf5e5140285644998172dc46d7da9121",
    "event.updated": "d-cf5e5140285644998172dc46d7da9121",
    "user.bye": "d-cf5e5140285644998172dc46d7da9121",
    "user.confirm": "d-cf5e5140285644998172dc46d7da9121",
    "user.contact": "d-cf5e5140285644998172dc46d7da9121",
    "user.invite": "d-cf5e5140285644998172dc46d7da9121",
    "user.progress": "d-cf5e5140285644998172dc46d7da9121",
    "user.survey": "d-cf5e5140285644998172dc46d7da9121",
    "user.welcome": "d-cf5e5140285644998172dc46d7da9121",
    "order.invoice": "d-cf5e5140285644998172dc46d7da9121",
    "order.progress": "d-cf5e5140285644998172dc46d7da9121",
    "order.shipped": "d-cf5e5140285644998172dc46d7da9121",
    "password.request": "d-cf5e5140285644998172dc46d7da9121",
    "password.updated": "d-cf5e5140285644998172dc46d7da9121"
  }
}