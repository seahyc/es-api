'use strict';

const mandrill = require('node-mandrill')(process.env.MANDRILL_API_KEY);
const email = function(results, recipient, next) {
    mandrill('/messages/send', {
        message: {
            to: [{email: recipient.email, name: recipient.name}],
            from_email: 'sginnovate@glints.com',
            subject: recipient.subject,
            text: recipient.message
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
