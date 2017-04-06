'use strict';

module.exports = {
    name: 'calculate',
    method: function (responses, tests, next) {
        try{
            const processedAnswers = {};
            const rawScore = {};
            responses.forEach(response => {
                processedAnswers[response.category] = processedAnswers[response.category] || [];
                processedAnswers[response.category].push(response);
            });

            tests.forEach(test => {
                test.categories.forEach(category => {
                    rawScore[category.code] = processedAnswers[category.code].reduce((runningTotal, answer) => {
                        let polarity;
                        switch (answer.polarity) {
                        case 'positive':
                            polarity = 1;
                            break;
                        case 'negative':
                            polarity = -1;
                            break;
                        default:
                            polarity = 0;
                            break;
                        }
                        return Number((runningTotal + (parseInt(answer.answer) * test.increment * polarity)).toFixed(2));
                    }, test.baseScore);
                });
            });

            next(null, rawScore);
        } catch (e) {
            next(e, null);
        }
    },
    options: {}
};
