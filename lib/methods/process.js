'use strict';

const _ = require('lodash');
const casBandClassifier = function(Bands, categoryCode, score) {
    return Bands.find({
        category: categoryCode,
        lowerBound: {
            '<=': score
        },
        upperBound: {
            '>=': score
        }
    });
};

const EGCalculateAverage = async function(Questions, categoryCode, score) {
    const count = await Questions.count({
        category: categoryCode
    });
    return Number((score/count).toFixed(2));
};

module.exports = {
    name: 'process',
    method: async function(profile, tests, Questions, Bands, next) {
        try{
            const results = [];
            for (let t = 0; t < tests.length; t++) {
                const test = tests[t];
                const testResult = {
                    test: test.code,
                    name: test.name,
                    categories: []
                };
                for (let c = 0; c < test.categories.length; c++) {
                    const category = test.categories[c];
                    const band = await casBandClassifier(Bands, category.code, profile[category.code]);
                    const average = await EGCalculateAverage(Questions, category.code, profile[category.code]);
                    const categoryDetail = {
                      category: category.code,
                      name: category.name,
                      score: profile[category.code]
                    };
                    switch (test.code) {
                      case 'CAS':
                        categoryDetail.band = band[0].band;
                        categoryDetail.order = band[0].order;
                        break;
                      case 'EG':
                        categoryDetail.average = average;
                        break;
                    }
                  testResult.categories.push(categoryDetail);
                }
                results.push(testResult);
            }
            results.forEach(result => {
              let parameters = ['score'];
              switch (result.test) {
                case 'CAS':
                    parameters.unshift('order');
                    break;
                case 'EG':
                    parameters.unshift('average');
                    break;
              }
              result.categories = _.sortBy(result.categories, parameters).reverse();
            });
            next(null, results);
        } catch (e) {
            next(e, null);
        }
    },
    options: {}
};
