var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var lib = require('../lib/libServer');

passport.use('user-local', new LocalStrategy(
    {
        usernameField: 'username'
    },
    function(username, password, done) 
    {
        User.findOne({ username: username },
        function (err, user) 
        {
            if (err) { return done(err); }

            if (!user) { return done(null, false, { message: 'Incorrect username.' } ); }

            if (!lib.validPassword(user.hash, user.salt, password))  { return done(null, false, { message: 'Incorrect password.' } ); }

            return done(null, user);
        });
    }
));
