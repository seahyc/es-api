'use strict';

module.exports = [
    {
        method: 'get',
        path: '/questions',
        config: {
            handler: (request, reply) => {
                const Questions = request.collections().questions;
                reply(Questions.find().sort('order ASC').populate('options'));
            }
        }
    }
];
