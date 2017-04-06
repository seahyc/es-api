'use strict';

const Config = require('./config');

// Glue manifest
const manifest = module.exports = {

    server: {
        app: {
            config: Config
        }
    },

    connections: [
        {
            host: Config.server.host,
            port: Config.server.port,
            labels: 'api',
            routes: {
                cors: {
                    origin: ['http://localhost:2000']
                }
            }
        }
    ],

    registrations: [
        {
            plugin: {
                register: 'dogwater',
                options: Config.dogwater
            }
        },
        {
            plugin: {
                register: 'bassmaster',
                options: {
                    batchEndpoint: '/',
                    tags: ['bassmaster', 'batch']
                }
            }
        }, {
            plugin: 'hapi-auth-cookie'
        },{
            plugin: './plugins/swagger'
        },
        {
            plugin: './plugins/pinger'
        },
        {
            plugin: {
                register: '../lib',
                options: Config.main
            }
        }
    ]

};

if (process.env.NODE_ENV === 'dev') {
    manifest.server.debug = {
        log: ['error', 'implementation', 'internal'],
        request: ['error', 'implementation', 'internal']
    };
}
