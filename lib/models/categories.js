module.exports = {
    identity: 'categories',
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
        test: {
            model: 'tests'
        },
        questions: {
            collection: 'questions',
            via: 'category'
        },
        bands: {
            collection: 'bands',
            via: 'category'
        }
    }
};
