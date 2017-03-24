const shortId = require('shortid');

module.exports = {
  identity: 'questions',
  connection: 'mongoDb',
  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: function() {
        return shortId.generate();
      }
    },
    type: {
      type: 'string',
      required: true
    },
    test: {
      type: 'string',
      enum: ['CAS', 'GRIT', 'EG', 'profile'],
      required: false
    },
    category: {
      type: 'string',
      enum: ['OB', 'PR', 'OP', 'PE', 'ME', 'ML', 'MP', 'IE', 'IL', 'IP', 'EE', 'EL', 'EP', 'P', 'CI'],
      required: false
    },
    polarity: {
      type: 'string',
      enum: ['positive', 'negative'],
      required: false
    },
    question: {
      type: 'string',
      required: true
    },
    regex: {
      type: 'string',
      required: false
    },
    errorMessage: {
      type: 'string',
      required: false
    },
    answers: {
      collection: 'answers',
      via: 'question'
    },
    survey: {
      model: 'surveys'
    }
  }
};
