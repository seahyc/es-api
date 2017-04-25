'use strict';

const _ = require('lodash');
const casBandClassifier = function(Bands, categoryCode, score) {
    if (score < 0) {
      score = 0;
    }
    return Bands.findOne({
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
                    categories: [],
                    profileOwner: profile.profileOwner,
                    createdAt: profile.createdAt
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
                        categoryDetail.band = band.band;
                        categoryDetail.percentile = band.percentile;
                        categoryDetail.order = band.order;
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
              result.profileId = profile.id;
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
