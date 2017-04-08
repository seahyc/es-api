'use strict';

const Boom = require('boom');

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


                            const htmlMessage = result.map(test => {
                              const colors = ['#FE6A42', '#FF9040', '#E8AC43', '#FFD940', '#E8E33E', '#A7FF47',
                                '#00FF43'];
                                switch (test.test){
                                  case 'GRIT':
                                      return `<h1>${test.name}</h1>
                                            <table cellpadding="10">
                                                <tr align="left"><th>Categories</th><th>Score</th></tr>
                                                ${test.categories.map(category => {
                                            return `<tr>
                                                <td width="200px">${category.name}</td>
                                                <td width="250px" bgcolor=${colors[Math.round(category.score/5*7) - 1]}>
                                                    ${category.score}</td>
                                            </tr>`
                                          }).join('')}
                                        </table>`;
                                      break;
                                  case 'CAS':
                                    return `<h1>${test.name}</h1>
                                            <table cellpadding="10">
                                                <tr align="left"><th>Categories</th><th>Band</th></tr>
                                                ${test.categories.map(category => {
                                            return `<tr>
                                                <td width="200px">${category.name}</td>
                                                <td width="250px" bgcolor=${colors[category.order - 1]}>
                                                    ${category.band}</td>
                                            </tr>`
                                    }).join('')}
                                        </table>`;
                                    break;
                                  case 'EG':
                                      const chartSrc = 'https://chart.googleapis.com/chart?cht=p&chs=650x460&'+
                                      `chl=${test.categories.map(c => c.average).join('|')}` +
                                      `&chd=t:${test.categories.map(c => c.average).join(',')}` +
                                      `&chdl=${test.categories.map(c => c.name).join('|')}` +
                                        '&chco=02A3BB|02495D|FF6440|CC1C14';
                                    console.log(test);
                                    return `<h1>${test.name}</h1><img src="${chartSrc}">`
                                }
                                }).join('').replace(/\\n/,'');

                            const recipient = { email: user.email, firstName: user.firstName };
                            const message = {
                                text: 'Nope',
                                html: htmlMessage,
                                subject: 'Your Profile'
                            };

                            request.server.methods.emailResults(recipient, message, (err, response) => {
                              reply(result);
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
