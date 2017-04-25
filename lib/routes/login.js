'use strict';
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const cert = fs.readFileSync(process.env.PRIVATE_KEY);

module.exports = [
    {
        method: 'post',
        path: '/login',
        config: {
            handler: async (request, reply) => {
              const email = request.payload.email;
              const password = request.payload.password;
              const Users = request.collections().users;
              const user = await Users.findOne({
                email: email
              });

              if (!user) {
                reply(Boom.forbidden('No such user exists'));
                return;
              }

              const passwordCheck = bcrypt.compareSync(password, user.password);

              if (!passwordCheck) {
                reply(Boom.badRequest('Invalid credentials.'));
                return;
              }
              const token = jwt.sign({id: user.id, role: user.type}, cert, { algorithm: 'RS256',
              issuer: 'es-api' });
              reply(token);
            }
        }
    }
];
