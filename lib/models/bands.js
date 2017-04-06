const shortId = require('shortid');

module.exports = {
    identity: 'bands',
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
        band: {
            type: 'string',
            required: true
        },
        lowerBound: {
            type: 'integer',
            integer: true,
            required: true
        },
        upperBound: {
            type: 'integer',
            integer: true,
            required: true
        },
        category: {
            model: 'categories'
        }
    }
};
