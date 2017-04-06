module.exports = {
    identity: 'tests',
    connection: 'mongoDb',
    attributes: {
        code: {
            type: 'string',
            primaryKey: true,
            unique: true
        },
        name: {
            type: 'string',
            required: true
        },
        baseScore: {
            type: 'integer',
            integer: true,
            required: false
        },
        increment: {
            type: 'float',
            required: false
        },
        survey: {model: 'surveys'
        },
        categories: {
            collection: 'categories',
            via: 'test'
        },
        questions: {
            collection: 'questions',
            via: 'test'
        }
    }
};
