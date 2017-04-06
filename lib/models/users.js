'use strict';
const shortId = require('shortid');

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
            type: 'string'
        },
        gender: {
            type: 'string',
            enum: ['male', 'female'],
            required: true
        },
        birthYear: {
            type: 'integer',
            integer: true,
            required: true
        },
        nationality: {
            type: 'string',
            required: true,
            alpha: true
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
            required: true,
            alpha: true
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
        profiles: {
            collection: 'profiles',
            via: 'profileOwner'
        },
        answers: {
            collection: 'answers',
            via: 'answerer'
        }
    }
};
