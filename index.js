const { Cliam } = require('./dist/index.js')
// Do some stuffs ...
  
let payload = {
  meta: {
    from: 'info@konfer.be',
    to: [
      { name: 'Steve', email: 'steve.lebleu1979@gmail.com' }
    ],
    subject: 'This is my title'
  },
  data: {
    name: 'Steve'
  },
}

Cliam.emit('user.welcome', payload)
  .then(res => {
    console.log('Email has been delivered: ', res);
  })
  .catch(err => {
    console.log('Error while mail sending: ', err)
  });



  /**
   * 
   * "_mode": {
    "api": {
      "name": "sendgrid",
      "credentials": {
        "apiKey": "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"
      },
      "templates": {
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
  },
   */