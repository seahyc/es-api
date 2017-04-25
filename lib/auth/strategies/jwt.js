'use strict';
const fs = require('fs');
const pub = fs.readFileSync(process.env.PUBLIC_KEY);

module.exports = {
    name: 'jwt',
    scheme: 'jwt',
    options : {
        key: pub,
        validateFunc: function (decoded, request, callback) {
            const User = request.collections().users;
            const validatedUser = User.find({ id: decoded.id });
            if (!validatedUser) {
                return callback(null, false);
            }
            return callback(null, true);
        },
        verifyOptions: { algorithms: [ 'RS256' ] }
    }
};
