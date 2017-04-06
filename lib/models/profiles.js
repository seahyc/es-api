const shortId = require('shortid');

module.exports = {
    identity: 'profiles',
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
        OB: {
            type: 'integer',
            integer: true,
            required: true
        },
        PR: {
            type: 'integer',
            integer: true,
            required: true
        },
        OP: {
            type: 'integer',
            integer: true,
            required: true
        },
        PE: {
            type: 'integer',
            integer: true,
            required: true
        },
        ME: {
            type: 'integer',
            integer: true,
            required: true
        },
        ML: {
            type: 'integer',
            integer: true,
            required: true
        },
        MP: {
            type: 'integer',
            integer: true,
            required: true
        },
        IE: {
            type: 'integer',
            integer: true,
            required: true
        },
        IL: {
            type: 'integer',
            integer: true,
            required: true
        },
        IP: {
            type: 'integer',
            integer: true,
            required: true
        },
        EE: {
            type: 'integer',
            integer: true,
            required: true
        },
        EL: {
            type: 'integer',
            integer: true,
            required: true
        },
        EP: {
            type: 'integer',
            integer: true,
            required: true
        },
        P: {
            type: 'float',
            required: true
        },
        CI: {
            type: 'float',
            required: true
        },
        profileOwner: {
            model: 'users'
        }
    }
};
