const shortId = require('shortid');

module.exports = {
    identity: 'questions',
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
        type: {
            type: 'string',
            enum: ['input', 'dropdown', 'dropdown-others', 'scale', 'mcq'],
            required: true
        },
        polarity: {
            type: 'string',
            enum: ['positive', 'negative'],
            required: false
        },
        personalAttribute: {
            type: 'string',
            required: false
        },
        question: {
            type: 'string',
            required: true
        },
        regex: {
            type: 'string',
            required: false
        },
        errorMessage: {
            type: 'string',
            required: false
        },
        answers: {
            collection: 'answers',
            via: 'question'
        },
        options: {
            collection: 'options',
            via: 'question'
        },
        survey: {
            model: 'surveys'
        },
        category: {
            model: 'categories'
        },
        test: {
            model: 'tests'
        }
    }
};
