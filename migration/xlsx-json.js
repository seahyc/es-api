const Parser = require('parse-xlsx');
const jsonfile = require('jsonfile');
const questionnaire = new Parser('questions.xlsx', 'Questionnaire');
const _ = require('lodash');
const personalQuestions = jsonfile.readFileSync('personal-questions.json');

function transformPolarity(polarity) {
    switch (polarity) {
    case 'P':
        return 'positive';
    case 'N':
        return 'negative';
    default:
        return null;
    }
}

const questions = questionnaire.records.map(question => {
    const newQuestion = {
        _id: parseInt(question.Index) + personalQuestions.length,
        type: 'scale',
        question: question.Questions,
        test: question.Test,
        options: [
            {
                'order': 1,
                'label': 1,
                'value': 1,
                'text': 'Strongly disagree'
            },
            {
                'order': 2,
                'label': 2,
                'value': 2
            },
            {
                'order': 3,
                'label': 3,
                'value': 3
            },
            {
                'order': 4,
                'label': 4,
                'value': 4
            },
            {
                'order': 5,
                'label': 5,
                'value': 5,
                'text': 'Strongly agree'
            }
        ]
    };

    if (question.Category !== 'NA') {
        newQuestion.category = question.Category;
    }
    const polarity = transformPolarity(question.Polarity);
    if (polarity) {
        newQuestion.polarity = polarity;
    }

    return newQuestion;
});

jsonfile.writeFileSync('survey-questions.json', questions, { spaces: 2 });

const TestCodes = new Parser('questions.xlsx', 'Test Code');

const categories = TestCodes.records.map(test => ({
    code: test['Category Code'],
    name: test['Category Name'],
    test: test['Test Code']
}));

let testCodes = [...new Set(TestCodes.values('Test Code'))];

testCodes = testCodes.map(code => {
    const test = TestCodes.records.filter(test => test['Test Code'] === code)[0];
    return {
        code: code,
        name: test['Test Name'],
        baseScore: parseInt(test['Base']),
        increment: parseFloat(test['Increment']),
        survey: 1
    };
});

jsonfile.writeFileSync('categories.json', categories, { spaces: 2 });
jsonfile.writeFileSync('tests.json', testCodes, { spaces: 2 });

const CAS = new Parser('questions.xlsx', 'CAS');

const bands = [];

CAS.records.forEach(cas => {
    for (const col in cas) {
        if (cas.hasOwnProperty(col) && col !== 'Band' && col !== 'Order' && col !== 'Percentile') {
            bands.push({
                band: cas.Band,
                order: parseInt(cas.Order),
                percentile: parseInt(cas.Percentile),
                category: col,
                lowerBound: parseInt(cas[col])
            });
        }
    }
});

bands.map((band, index, array) => {
    const upperBand = _.find(array, {
        category: band.category,
        order: band.order + 1
    });

    band.upperBound = upperBand ? upperBand.lowerBound - 1 : 100;
    return band;
});

jsonfile.writeFileSync('cas.json', bands, { spaces: 2 });
