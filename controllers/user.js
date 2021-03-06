var express = require('express')
,	mongoose = require('mongoose')
,	passport = require('passport')
,	bcrypt = require('bcrypt')
,	util = require('../utils')
, config = require('../config/config')
, User = require('../models/User')
,	Product = require('../models/Product')
, Order = require('../models/Order')
,	Cart = require('../models/Cart');
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
		    	 console.log(req.body)
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
	 
	 user.updateStockDetail = function(req,res,next){

	 	console.log('inside UpdateStockDetail')
	 	
	 	var quantity = Number(req.body.quantid), flag=false;
    if(quantity=='')
      quantity=1

  		if(req.params.id){
  			Product.findByIdAndUpdate(req.params.id, req.body,
  			function(err,product){
  				if(err){
  					return next(err);
  				}
  				if(product){
  					console.log('Inside Product')
            console.log(product)
  			
            Cart.find({userId:req.user.id}).exec(function(err,cart){
            if(err){return next(err);}
            if(cart.length>0)
            {
              console.log(cart)
              console.log('if')

              cart[0].details.forEach(function(data){
                console.log(typeof (JSON.stringify(data.productId)))
                console.log(typeof (JSON.stringify(product._id)))
                console.log((JSON.stringify(data.productId)) === (JSON.stringify(product._id)))

                if((JSON.stringify(data.productId)) === (JSON.stringify(product._id)))
                  {
                    console.log('Inside similar productID')
                    console.log(data.quantity)
                    data.quantity=data.quantity+quantity
                    console.log(data.quantity)
                    flag=true;
                    
                  }
                  // else{
                  //   console.log('Iam in else of similar productId')
                  //   cart[0].details.push({productId:product.id,quantity:quantity});
                  // }
                 

              })//ForEach loop closed 
              if(!flag){
                cart[0].details.push({productId:product.id,quantity:quantity});
              }
              console.log('save')
              cart[0].save(function(err,cartQuantity){
                  if(err){return next(err);}

                  if(cartQuantity){
                    console.log('inside cart save')
                    console.log('after cartInstance save')
                    if(product.stock>0 && product.stock>=quantity)
                    {
                      product.stock=(product.stock)-quantity;
                      
                    }
                          else
                           {
                            return res.json(404, {error: 'Please check the update value'});  
                           }


                          product.save(function(err,product){
                          if(err){return next(err);}
                          if(product){
                            console.log('Hello SQR')
                            console.log(req.user)
                            return res.json(product);  
                            
                          }
                          else{
                            return res.json(404, {error: 'Unable to update product!'});  
                          }
                        });

                    }//if(cartQyantity) closed
                  else{
                    console.log('outside cart save data not saved')
                  }  

              });//save close



            } //if(cart.length>0) loop ends
            else
            {
              console.log('else')
                var cartInstance = new Cart({userId:req.user.id,details:[{productId:product.id,quantity:quantity}]});
                cartInstance.save(function(err,cartItem){
                  if(err){return next(err);}
                  if(cartItem){
                  console.log('after cartInstance save')
                            
                                if(product.stock>0 && product.stock>=quantity)
                                  {
                                    product.stock=(product.stock)-quantity;
                                   }
                            else
                             {
                                return res.json(404, {error: 'Please check the update value'});  
                              }
                            
                    product.save(function(err,product){
                    if(err){return next(err);}
                    if(product){
                      console.log('Hello SQR')
                      console.log(req.user)
                      return res.json(product);  
                      
                    }
                    else{
                      return res.json(404, {error: 'Unable to update product!'});  
                    }
                  });
                  }else{
                    console.log('else..')
                  } 
                });

            } //outer else closed      

  			});

  		}
    })
  }

	 };


	 user.searchProduct= function (req, res, next){
      if(req.params.id){
      Product.findById(req.params.id,req.body, 
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

      user.showProductDetail= function(req,res,next){
      	if(req.params.id){
      		Product.findById(req.params.id,
      		 function(err,product){	
      		  if(err){ return next(err);}
      		  if(product){
      		  	console.log('showProductDetail')
      		  	return res.json(product);
      		  }	else{
      		  	return res.json(404,{error:'Product Details not found!'});
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
	      		req.logIn(user, function(err) {
          if (err) { return next(err); }
         
                  
          console.log('login successfully'+user.role);
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
	 
	  return res.json({msg: config.messages.signOut});
	};
	

	return user;

  };

