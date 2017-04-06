'use strict';

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
                    [test.code]: []
                };
                for (let c = 0; c < test.categories.length; c++) {
                    const category = test.categories[c];
                    const band = await casBandClassifier(Bands, category.code, profile[category.code]);
                    const average = await EGCalculateAverage(Questions, category.code, profile[category.code]);
                    switch (test.code) {
                    case 'CAS':
                        testResult[test.code].push({
                            category: category.code,
                            band: band[0].band,
                            score: profile[category.code]
                        });
                        break;
                    case 'EG':
                        testResult[test.code].push({
                            category: category.code,
                            average: average,
                            score: profile[category.code]
                        });
                        break;
                    case 'GRIT':
                        testResult[test.code].push({
                            category: category.code,
                            score: profile[category.code]
                        });
                        break;
                    }
                }
                results.push(testResult);
            }
            next(null, results);
        } catch (e) {
            next(e, null);
        }
    },
    options: {}
};
