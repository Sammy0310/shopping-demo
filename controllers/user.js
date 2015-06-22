var express = require('express')
,	mongoose = require('mongoose')
,	passport = require('passport')
,	bcrypt = require('bcrypt')
,	util = require('../utils')
,   config = require('../config/config')
,   User = require('../models/User')
,	Product = require('../models/Product')
,   Order = require('../models/Order');
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

	 user.productAdd = function(req,res,next){

		var productInstance = new Product(req.body);
		productInstance.save(function(err, product){
		if (err) { return next(err)};
		    if(product) {
		    	 console.log('inside product add')
		    	 // consolelog(product)	
		         return res.json(product);
		    }
		    else {
		      return res.status(500).json({error: 'Unable to add Product!'});
		    }		    
		});
	 };

	 user.productList = function(req,res,next){
	 	
	 	
	 	Product.find({},function(err,products)
	 	{
	 		if(err)
	 			return next(err);
	 		if(products)
	 		{
	 			// console.log('inside productList')
	 			console.log(products)
	 			return res.json(products);
	 		}
	 		else
	 		{
	 			return res.json(404,{error:'Product Not found'})
	 		}
	 	});
	 };

	 user.editProduct = function(req,res,next){

	 	console.log('inside editProduct')
  		if(req.params.id){
  			Product.findByIdAndUpdate(req.params.id, req.body,
  			function(err,product){
  				if(err){
  					return next(err);
  				}
  				if(product){
  					console.log('inside editProduct')
  					console.log(product)
  					return res.json(product);
  				}else{
  					return res.json(404,{error: 'Product Not Found !'})
  				}
  			});
  		}
	 };
	 
	 // user.editSave = function(req,res,next){

	 // }

	 user.searchProduct= function (req, res, next){
      if(req.params.id){
      Product.findById(req.params.id, 
       function(err,product){
        if(err){ return next(err);}

        if(product){
          return res.json(product);
        } else {
          return res.json(404, {error: ' Product not found!'});
        }
        });
       }  
      };




	user.delete = function(req,res,next){

  		if(req.params.id){
  			Product.remove({_id:req.params.id},
  			function(err,products){
  				if(err){
  					return next(err);
  				}
  				else{
  					console.log('product deleted');
  					console.log(''+products+'documents deleted')
  					res.json(products);
  				}

  			})	
  		}
  	};



	user.authenticate = function(req, res, next){
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err)};

	    if (!user) {
	      res.status(500).json({error: info.message});
	    } else {
	      		return res.json(user);  
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
	 
	  return res.json({msg: config.messages.signOut});
	};

	return user;

  };

