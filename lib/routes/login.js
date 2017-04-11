'use strict';
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = [
    {
        method: 'post',
        path: '/login',
        config: {
            handler: async (request, reply) => {
              const email = request.payload.email;
              const password = request.payload.password;
              const Users = request.collections().users;
              const user = await Users.find({
                email: email
              });

              if (!user.length) {
                reply(Boom.forbidden('No such user exists'));
                return;
              }

              const passwordCheck = bcrypt.compareSync(password, user[0].password);

              if (!passwordCheck) {
                reply(Boom.forbidden('Invalid credentials.'));
                return;
              }
              const token = jwt.sign({id: user.id, role: user.type}, 'secret');

              const cache = request.server.cache({segment: 'tokens', expiresIn: 60 * 60 * 1000 });
              cache.get(String(user.id), (err, value) => {
                console.log(value);
              });
              cache.set(String(user.id), token, null, err => {
                if (err) {
                  reply(Boom.badImplementation('Error saving token'));
                  return;
                }
                reply(token);
              });
            }
        }
    }
];
