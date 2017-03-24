'use strict';

const Path = require('path');
const SailsMongo = require('sails-mongo');

module.exports = {

    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 2001
    },

    main: {
        connection: process.env.NODE_ENV === 'dev' ? 'mongoDb' : 'mongoDb'
    },

    dogwater: {
        connections: {
            mongoDb: {
                adapter: 'mongo',
                port: 27017,
                host: 'mongo',
                database: 'es'
            }
        },
        adapters: {
            mongo: SailsMongo,
        }
    },

    poop: {
        logPath: Path.normalize(`${__dirname}/../poop.log`)
    }

};
