'use strict';
const Boom = require('boom');

module.exports = [
    {
        method: 'get',
        path: '/users',
        config: {
          auth: 'jwt',
          handler: async (request, reply) => {
              let whereClause = request.query.where;
              if (whereClause) {
                whereClause = JSON.parse(whereClause);
              }
              const credentials = request.auth.credentials;
              if (credentials.role !== 'admin') {
                reply(Boom.forbidden('Sorry, you are not an admin.'));
              }
              const Users = request.collections().users;
              let users;
              if (whereClause) {
                users = await Users.find(whereClause).populate('profiles');
              } else {
                users = await Users.find().populate('profiles');
              }
              users.forEach(user => delete user.password);
              reply(users);
            }
        }
    },
    {
        method: 'get',
        path: '/users/{id}',
        config: {
            auth: 'jwt',
            handler: async (request, reply) => {
              let include = [];
              if (Object.keys(request.query).length > 0) {
                include = JSON.parse(request.query.include);
              }
              const credentials = request.auth.credentials;
              const Users = request.collections().users;
              let user;
              if (include.length) {
                user = await Users.findOne({id: request.params.id}).populate(include[0].resource, include[0].options);
              } else {
                user = await Users.findOne({id: request.params.id});
              }
              if (!user) {
                reply(Boom.notFound('User not found'));
                return;
              }
              if (user.id !== credentials.id && credentials.role !== 'admin') {
                reply(Boom.unauthorized('Sorry, this is not your profile'));
                return;
              }
              delete user.password;
              delete user.agreeToMarketing;
              delete user.id;
              delete user.createdAt;
              delete user.updatedAt;
              delete user.type;
              reply(user);
            }
        }
    }
];
