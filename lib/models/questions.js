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
            model: 'surveys',
            required: true
        },
        category: {
            model: 'categories',
            required: true
        },
        test: {
            model: 'tests',
            required: true
        }
    }
};
