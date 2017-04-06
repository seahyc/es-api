'use strict';

const Path = require('path');
const SailsMongo = require('sails-mongo');

module.exports = {

    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 2001,
        routes: {
            cors: {
                origin: ['http://localhost:2000', 'https://survey.glints.com',
                  'https://survey.staging.glints.com']
            }
        }
    },

    main: {
        connection: process.env.NODE_ENV === 'dev' ? 'mongoDb' : 'mongoDb'
    },

    dogwater: {
        connections: {
            mongoDb: {
                adapter: 'mongo',
                port: 27017,
                host: process.env.MONGO_HOST || 'mongo',
                database: process.env.MONGO_DB,
                user: process.env.MONGO_USERNAME,
                password: process.env.MONGO_PASSWORD
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
