'use strict';
const Boom = require('boom');

module.exports = [
    {
        method: 'post',
        path: '/login',
        config: {
            handler: (request, reply) => {
              const email = request.payload.email;
              const password = request.payload.password;
              const Users = request.collections().users;
              const user = Users.find({
                email: email,
                password: password
              });
              if (!user) {
                  reply(Boom.forbidden('No such user exists'));
                  return;
              }
              request.cookieAuth.set(user);
              reply('Login successful');
            }
        }
    }
];
