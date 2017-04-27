'use strict';

module.exports = [
    {
        method: 'get',
        path: '/questions',
        config: {
            handler: async (request, reply) => {
                const params = request.query;
                const filters = {};
                for (let key in params) {
                  if (Object.prototype.hasOwnProperty.call(params, key)) {
                        switch (key) {
                          case 'surveyId':
                              filters.survey = parseInt(params[key]);
                              break;
                        }
                    }
                }
                const Questions = request.collections().questions;
                const questions = await Questions.find(filters).sort('order ASC').populate('options');
                const personalQuestions = Array.prototype.map.call(Array.prototype.filter.call(questions,
                  qn => qn.personalAttribute), qn => { qn.order = qn.id; return qn; });
                const surveyQuestions = Array.prototype.filter.call(questions, qn => !qn.personalAttribute);
                surveyQuestions.sort(() => Math.random() * 2 - 1);
                reply(personalQuestions.concat(surveyQuestions.map((qn, index) => {
                  qn.order = personalQuestions.length + index + 1;
                  return qn;
                })));
            }
        }
    }
];
