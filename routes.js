module.exports = function(app){
	var userController = require('./controllers/user')(app)
	, rootController = require('./controllers/root')(app)
	, passportConfig = require('./config/passport-config.js');

	 app.get('/', rootController.landing);
     app.get('/users/user', rootController.user);  
     app.get('/users/profile', passportConfig.isAuthenticated, rootController.userProfile);
     app.get('/users/homepage', passportConfig.isAuthenticated, rootController.homepage);  
  	 app.post('/users/create', userController.create);
  	 app.post('/users/authenticate', userController.authenticate);
  	 app.get('/users/fbauth', userController.startFbAuthentication);
  	 app.get('/users/fbAuthenticationComplete', userController.onFbAuthenticationComplete);
     app.get('/users/logout', userController.logout);
     
};