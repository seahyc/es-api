'use strict';

module.exports = [
	{
		method: 'get',
		path: '/questions',
		config: {
			tags: ['api'],
			handler: (request, reply) => {
				const Questions = request.collections().questions;
				reply(Questions.find());
			}
		}
	},
	{
		method: 'post',
		path: '/questions',
		config: {
			tags: ['api'],
			handler: (request, reply) => {
				const Questions = request.collections().questions;
				Questions.create
			}
		}
	}
]
