'use strict';

const Boom = require('boom');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = [
    {
        method: 'post',
        path: '/answers',
        config: {
            handler: async (request, reply) => {
                try {
                    const surveyId = parseInt(request.payload.surveyId);
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

                    let savedUser = await Users.findOne({email: user.email});
                    const plainPassword = crypto.randomBytes(6).toString('base64');

                    if (!savedUser) {
                      user.password = plainPassword;
                      savedUser = await Users.create(user);
                    } else {
                      user.password = bcrypt.hashSync(plainPassword, 10);
                      const updatedUser = await Users.update({email: user.email}, user);
                      savedUser = updatedUser[0];
                    }

                    if (!savedUser) {
                        reply(Boom.badRequest('Error saving user.'));
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
                        result.survey = surveyId;
                        const profile = await Profiles.create(result);
                        return request.server.methods.process(profile, tests, Questions, Bands, (err, result) => {
                            if (err) {
                                reply(Boom.badImplementation(err));
                                return;
                            }


                            const htmlMessage = result.map(test => {
                              const colors = ['#FF6412', '#FD8933', '#E8AC43', '#FFD940', '#E8E33E', '#B8FF52',
                                '#8AEA7C'];
                                switch (test.test){
                                  case 'GRIT':
                                      return `<h1>${test.name}</h1>
                                            <table cellpadding="10">
                                                <tr align="left"><th>Category</th><th>Score</th></tr>
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
                                                <tr align="left"><th>Category</th><th>Band</th></tr>
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
                                      const egColors = ['DC3912', '3366CC', 'FF9900', '109618'];
                                      const egColorsFaded = ['F98174', 'B2D5E7', 'EEEB97', 'AAE28D'];
                                      const total = test.categories.reduce((runningTotal, cat) => runningTotal + cat.average, 0);
                                      const percentage = test.categories.map(cat =>
                                        Math.round((cat.average / total) * 10000) / 100);
                                      const faded = percentage.map(percentage => Boolean(percentage < 22.5));
                                      const finalColors = faded.map((faded, index) => faded ? egColorsFaded[index] : egColors[index]);
                                      const chartSrc = 'https://chart.googleapis.com/chart?cht=p&chs=650x460&'+
                                        `chl=${percentage.map(p => p).join('|')}` +
                                        `&chd=t:${percentage.map(p => p).join(',')}` +
                                        `&chdl=${test.categories.map(c => c.name).join('|')}` +
                                        `&chco=${finalColors}`;
                                    return `<h1>${test.name}</h1><img src="${chartSrc}">`
                                }
                                }).join('<b/><b/><hr>').concat(`<br/><br/><hr><p>To view this result, you can also visit <a href="https://survey.glints.com/results/${profile.id}">https://survey.glints.com/results/${profile.id}</a>. To view all your results, login to <a href="https://survey.glints.com/results">https://survey.glints.com/results</a> with this email and the password <u>${plainPassword}</u></p>`).replace(/\\n/,'');

                            const recipient = { email: user.email, firstName: user.firstName };
                            const message = {
                                text: `To view results, login to https://survey.glints.com/results with this email and 
                                the password ${plainPassword}.`,
                                html: htmlMessage,
                                subject: 'Your Profile'
                            };

                            request.server.methods.emailResults(recipient, message, (err, response) => {
                              reply({data: {profileId: result[0].profileId}});
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
