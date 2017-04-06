const adminHash = '$2a$10$PItpjd1cSH/.XGW2mekpWeKYSXZSt4qF6QoedERw6MydBWQbYI9Vi';

const cas = require('./cas.json');
const categories = require('./categories.json');
const personalQuestions = require('./personal-questions.json');
const surveyQuestions = require('./survey-questions.json');
const tests = require('./tests.json');
const survey = require('./survey.json');

module.exports = {
    adminHash,
    cas,
    categories,
    personalQuestions,
    surveyQuestions,
    tests,
    survey
};
