'use strict';

module.exports = {
    name: 'token',
    scheme: 'bearer-access-token',
    options : {
        allowQueryToken: false,
        validateFunc: function (token, callback) {
            server.app.userCache.get(token, (err, value) => {
                if (err || !value) {
                    return callback(null, false);
                }
                return callback(null, true, value);
            });
        }
    }
};
