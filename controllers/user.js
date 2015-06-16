var express = require('express')
,	mongoose = require('mongoose')
,	passport = require('passport')
,	bcrypt = require('bcrypt')
,	util = require('../utils')
,   config = require('../config/config')
,   User = require('../models/User');

module.exports = function(app) {

	var user = {};

	user.create = function(req,res,next){

		var user = new User(req.body);
		user.set('fullname', req.body.firstName + ' ' + req.body.lastName);
		user.set('password', req.body.password);

		user.confirmationToken = util.getRandomToken();

		user.createdAt =
		user.updatedAt =
		user.confirmationTokenSentAt = new Date();

		user.save(function(err, user){
		if (err) { return next(err)};
		    if(user) {
		         return res.json(user);
		    }
		    else {
		      return res.status(500).json({error: 'Unable to add user!'});
		    }		    
		});
	 };

	user.authenticate = function(req, res, next){
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err)};

	    if (!user) {
	      res.status(500).json({error: info.message});
	    } else {
	      req.logIn(user, function(err) {
	        if (err) { return next(err); }
	        
	        user.addSignInIp(req.ip, function(err){
	          if (err) return next(err);
	        });
	        return res.json(user);       
	      });
	    };
	  })(req, res, next);
	};

	user.startFbAuthentication = function(req, res, next){
	  passport.authenticate('facebook', {
	    scope:['email', 'read_stream', 'publish_actions'],
	    profileFields: ['email', 'picture']
	  })(req, res, next);
	};

	user.onFbAuthenticationComplete = function(req, res, next){
	  passport.authenticate('facebook', function(err, user, info) {
	    if (err) { return next(err);}
	    if (!user) {
	      return res.status(500).json({error: 'User not found!'});
	    }
	    return req.logIn(user, function(err) {
	      if (err) { return next(err);}

	      if(info != null) {
	        return res.redirect(info.redirectTo);
	      }        
	    });
	  })(req, res, next);
	};

	user.logout = function(req, res){
	  req.logout();
	  req.flash('info', {msg: config.messages.signOut});
	  return res.json({msg: config.messages.signOut});
	};

	return user;

  };

