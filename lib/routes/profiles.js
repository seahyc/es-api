'use strict';
const Boom = require('boom');

module.exports = [
    {
        method: 'get',
        path: '/profiles',
        config: {
          auth: 'jwt',
          handler: (request, reply) => {
              const Profiles = request.collections().profiles;
              reply(Profiles.find());
            }
        }
    },
    {
        method: 'get',
        path: '/profiles/{id}',
        config: {
            handler: async (request, reply) => {
              let include = [];
              if (Object.keys(request.query).length > 0) {
                include = JSON.parse(request.query.include);
              }
              const Bands = request.collections().bands;
              const Profiles = request.collections().profiles;
              const Tests = request.collections().tests;
              let profile;
              if (include.length) {
                profile = await Profiles.findOne({id: request.params.id}).populate(include[0].resource, include[0].options);
              } else {
                profile = await Profiles.findOne({id: request.params.id});
              }
              delete profile.profileOwner.password;
              delete profile.profileOwner.agreeToMarketing;
              delete profile.profileOwner.id;
              delete profile.profileOwner.createdAt;
              delete profile.profileOwner.updatedAt;
              delete profile.profileOwner.type;
              const Questions = request.collections().questions;
              const tests = await Tests.find({survey: parseInt(profile.survey)}).populate('categories');
              request.server.methods.process(profile, tests, Questions, Bands, (err, result) => {
                if (err) {
                  reply(Boom.badImplementation(err));
                  return;
                }
                reply(result);
              });
            }
        }
    }
];
