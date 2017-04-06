const shortId = require('shortid');

module.exports = {
    identity: 'options',
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
        order: {
            type: 'integer',
            integer: true,
            required: true
        },
        label: {
            type: 'string',
            required: true
        },
        value: {
            type: 'string',
            required: true
        },
        text: {
            type: 'string',
            required: false
        },
        question: {
            model: 'questions'
        }
    }
};
