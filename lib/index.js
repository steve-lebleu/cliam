"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliam = void 0;
const cliam_class_1 = require("./classes/cliam.class");
Object.defineProperty(exports, "Cliam", { enumerable: true, get: function () { return cliam_class_1.Cliam; } });
const payload = {
    meta: {
        subject: 'Test request password',
        to: [{
                name: 'Steve Lebleu',
                email: 'steve.lebleu1979@gmail.com'
            }],
        from: {
            name: 'Steve Lebleu',
            email: 'info@konfer.be'
        },
        replyTo: {
            name: 'Steve Lebleu',
            email: 'info@konfer.be'
        }
    },
    data: {
        user: {
            username: 'steve',
            email: 'steve.lebleu1979@gmail.com'
        },
        cta: {
            label: 'Click me',
            link: 'https://www.karpeace.com'
        }
    }
};
cliam_class_1.Cliam.emit('password.request', payload)
    .then(result => {
    console.log('Success:', result);
})
    .catch(err => {
    console.log('Error', err);
});
