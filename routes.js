module.exports = function(app){
	var userController = require('./controllers/user')(app)
	, rootController = require('./controllers/root')(app)
	, passportConfig = require('./config/passport-config.js');

	 app.get('/', rootController.landing);
     app.get('/users/user', rootController.user);  
     app.get('/users/profile', passportConfig.isAuthenticated, rootController.userProfile);
     app.get('/users/homepage', passportConfig.isAuthenticated, rootController.homepage);  
  	 app.post('/users/create', userController.create);
  	 // app.post('/users/addproduct',userController.productAdd);
     app.get('/users/productlist',userController.productList);
     app.get('/users/productlist/:id',userController.searchProduct);
     app.post('/users/productlist',userController.productAdd);
     app.put('/users/productlist/:id',userController.editProduct);
     app.delete('/users/productlist/:id',userController.delete);
     app.get('/users/productdetail/:id',userController.showProductDetail);
     app.put('/users/productdetail/:id',userController.updateStockDetail)
  	// app.post('/users/productlist',userController.editSave);
     app.post('/users/authenticate', userController.authenticate);
  	 app.get('/users/fbauth', userController.startFbAuthentication);
  	 app.get('/users/fbAuthenticationComplete', userController.onFbAuthenticationComplete);
     app.get('/users/logout', userController.logout);
     
};

