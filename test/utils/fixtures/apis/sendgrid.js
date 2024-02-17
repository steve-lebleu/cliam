module.exports = {
  "name": "sendgrid",
  "credentials": {
    "apiKey": process.env.SENDGRID_API_KEY
  },
  "templates" : {
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