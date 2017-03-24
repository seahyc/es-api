const shortId = require('shortid');

module.exports = {
  identity: 'profiles',
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
    answer: {
      type: 'integer',
      integer: true,
      required: true
    },
    profileOwner: {
      model: 'users'
    }
  }
};
