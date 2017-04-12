'use strict';

module.exports = {
    name: 'jwt',
    scheme: 'jwt',
    options : {
        key: 'secret',
        validateFunc: function (decoded, request, callback) {
            const User = request.collections().users;
            const validatedUser = User.find({ id: decoded.id });
            if (!validatedUser) {
                return callback(null, false);
            }
            return callback(null, true, decoded);
        },
        verifyOptions: { algorithms: [ 'HS256' ] }
    }
};
