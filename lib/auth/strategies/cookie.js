'use strict';

module.exports = {
    name: 'session',
    scheme: 'cookie',
    options : {
        cookie: 'es',
        redirectTo: '/login',
        password: ']4]_h$*z7w]PuTL/HxK`b{p3RB)zP!;X',
        validateFunc: function (request, session, callback) {
            const Users = request.collections().users;
            const user = Users.find({ email: session.email });
            if (!user) {
                return callback(null, false);
            }

            callback(null, true, user);
        }
    }
};
