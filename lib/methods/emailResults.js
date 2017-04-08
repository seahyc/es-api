'use strict';

const mandrill = require('node-mandrill')(process.env.MANDRILL_API_KEY);
const email = function(recipient, message, next) {
    mandrill('/messages/send', {
        message: {
            to: [{email: recipient.email, name: recipient.firstName}],
            from_email: 'oswald@glints.com',
            subject: message.subject,
            text: message.text,
            html: message.html
        }
    }, function(error, response) {
    //uh oh, there was an error
        if (error) {
            next(error, null);
        }
    //everything's good, lets see what mandrill said
        else {
            next(null, response);
        }
    });
};

module.exports = {
    name: 'emailResults',
    method: email,
    options: {}
};
