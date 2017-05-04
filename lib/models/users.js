'use strict';
const shortId = require('shortid');
const bcrypt = require('bcrypt');

module.exports = {
    identity: 'users',
    connection: 'mongoDb',
    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true,
            defaultsTo: function() {
                return shortId.generate();
            }
        },
        firstName: {
            type: 'string',
            required: true
        },
        lastName: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: 'string',
            required: true
        },
        type: {
            type: 'string',
            enum: ['admin', 'responder'],
            required: true,
            defaultsTo: 'responder'
        },
        gender: {
            type: 'string',
            enum: ['Male', 'Female'],
            required: true
        },
        birthYear: {
            type: 'integer',
            integer: true,
            required: true
        },
        nationality: {
            type: 'string',
            required: true
        },
        educationLevel: {
            type: 'string',
            required: true
        },
        major: {
            type: 'string',
            required: true
        },
        ethnicity: {
            type: 'string',
            required: true
        },
        workingExperience: {
            type: 'string',
            required: true
        },
        agreeToMarketing : {
            type: 'boolean',
            required: true,
            boolean: true
        },
        tags: {
            type: 'string'
        },
        profiles: {
            collection: 'profiles',
            via: 'profileOwner'
        },
        answers: {
            collection: 'answers',
            via: 'answerer'
        }
    },
    beforeCreate: function (values, cb) {
        // Hash password
        bcrypt.hash(values.password, 10, function(err, hash) {
          if(err) return cb(err);
          console.log(values.password, hash);
          values.password = hash;
          //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
          cb();
        });
    }
};
