const shortId = require('shortid');

module.exports = {
    identity: 'answers',
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
        answer: {
            type: 'integer',
            integer: true,
            required: true
        },
        answerer: {
            model: 'users',
            required: true
        },
        question: {
            model: 'questions',
            required: true
        }
    }
};
