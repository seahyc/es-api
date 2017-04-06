'use strict';

const Boom = require('Boom');

module.exports = [
    {
        method: 'post',
        path: '/answers',
        config: {
            handler: async function(request, reply) {
                try {
                    const surveyId = request.payload.surveyId;
                    const Users = request.collections().users;
                    const Answers = request.collections().answers;
                    const Tests = request.collections().tests;
                    const Questions = request.collections().questions;
                    const Profiles = request.collections().profiles;
                    const Bands = request.collections().bands;

                    const user = {};
                    const questions = await Questions.find({survey: surveyId});
                    const surveyResponses = questions.map(question => {
                        const response = request.payload.responses[question.id];
                        if (response.personalAttribute) {
                            user[response.personalAttribute] = response.answer;
                        }
                        else if (response.answer) {
                            question.answer = response.answer;
                        }
                        return question;
                    }).filter(question => question.answer);

                    user.email = user.email.toLowerCase();

                    await Users.native((err, collection) => {
                        collection.update({
                            email: user.email
                        },
							user,
							{upsert: true}
						);
                    });

                    const savedUser = await Users.find({where: {email: user.email}});

                    if (!savedUser) {
                        reply(Boom.badRequest('User not saved.'));
                        return;
                    }

                    const answersToSave = surveyResponses.map(response => ({
                        answer: parseInt(response.answer),
                        question: response.id,
                        answerer: savedUser.id
                    }));

                    await Answers.create(answersToSave);

                    const tests = await Tests.find({survey: surveyId}).populate('categories');

                    request.server.methods.calculate(surveyResponses, tests, async (err, result) => {
                        if (err) {
                            reply(Boom.badImplementation(err));
                            return;
                        }
                        result.profileOwner = savedUser.id;
                        const profile = await Profiles.create(result);
                        return request.server.methods.process(profile, tests, Questions, Bands, (err, result) => {
                            if (err) {
                                reply(Boom.badImplementation(err));
                                return;
                            }

                            reply(result);

                            request.server.methods.emailResults(result, {}, (err, response) => {
                                return response;
                            });
                        });
                    });
                } catch (e) {
                    reply(Boom.badImplementation(e));
                }
            }
        }
    }
];
