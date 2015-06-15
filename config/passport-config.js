/*****/

var passport = require('passport')
, localStrategy = require('passport-local').localStrategy
, facebookStrategy = require('passport-facebook').Strategy
, User = require('../models/User')
, bcrypt = require('../utils')
, secret = require('./secret');

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new localStrategy({usernameField: 'email'}, function(username, password, done){

process.nextTick(function(){
	User.findOne({email: username}, function(err, user){
		if(err){
			return done(err);
		}
		if (!user) {
			return done(null, false, { message: 'Email : ' + username + 'is not registered with the application'});
		}
		else{
			var passwordMatch = bcrypt.compareSync(password, user.hash);
			if (passwordMatch) {
				return done(null,user);
			}else{
				return done(null, false, { message: 'Invalid email or password.' });
			}
		}
	});

  });
}));