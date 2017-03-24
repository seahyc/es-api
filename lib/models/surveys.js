const shortId = require('shortid');

module.exports = {
  identity: 'surveys',
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
    title: {
      type: 'string',
      required: true
    },
    instructions: {
      type: 'string',
      required: false
    },
    questions: {
      model: 'questions',
      via: 'survey'
    }
  }
};
