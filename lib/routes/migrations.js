'use strict';

const migrations = require('../../migration/migration');
const bcrypt = require('bcrypt');
const Boom = require('Boom');

async function bulkUpsert(collection, inserts, criteria) {
    const bulkWrite = inserts.map(insert => {
        const findObject = {};
        criteria.forEach(criterion => {
            findObject[criterion] = insert[criterion];
        });
        return { updateOne:
        { filter: findObject,
            update: insert,
            upsert: true
        }
        };
    });

    await collection.bulkWrite(bulkWrite);
}

module.exports = [
    {
        method: 'post',
        path: '/migrate',
        config: {
            tags: ['api'],
            handler: async (request, reply) => {
                const authCode = request.payload['auth_code'];
                const authorised = bcrypt.compareSync(authCode, migrations.adminHash);
                if (!authorised) {
                    reply(Boom.unauthorized('Invalid auth code'));
                } else {
                    const Surveys = request.collections().surveys;
                    const Tests = request.collections().tests;
                    const Categories = request.collections().categories;
                    const CasBands = request.collections().bands;
                    const Questions = request.collections().questions;
                    const Options = request.collections().options;
                    const survey = migrations.survey[0];
                    const tests = migrations.tests;
                    const categories = migrations.categories;
                    const casBands = migrations.cas;
                    const options = [];
                    const questions = migrations.personalQuestions.concat(migrations.surveyQuestions).map(qn => {
                        if (qn.options) {
                            qn.options.forEach(opt => {
                                opt.question = qn.order;
                                opt.label = String(opt.label);
                                options.push(opt);
                            });
                            delete qn.options;
                        }
                        qn.survey = survey._id;
                        return qn;
                    });

                    try {
                        await Surveys.native((err, collection) => {
                            collection.update({ id: survey.id },
                            survey,
                            { upsert: true });
                        });
                        await Tests.native(async (err, collection) => {
                            await bulkUpsert(collection, tests, ['code']);
                        });
                        await CasBands.native(async (err, collection) => {
                            await bulkUpsert(collection, casBands, ['band', 'category']);
                        });
                        await Categories.native(async (err, collection) => {
                            await bulkUpsert(collection, categories, ['code']);
                        });
                        await Questions.native(async (err, collection) => {
                            await bulkUpsert(collection, questions, ['order']);
                        });

                        await Options.native(async (err, collection) => {
                            await bulkUpsert(collection, options, ['question', 'order']);
                        });
                    } catch (e) {
                        reply (Boom.badImplementation(e));
                        return;
                    }
                    const results = {};
                    results.surveys = await Surveys.find();
                    results.tests = await Tests.find().populate('categories');
                    results.categories = await Categories.find().populate('bands');
                    results.questions = await Questions.find().populate('options');
                    reply(results);
                }
            }
        }
    }
];
