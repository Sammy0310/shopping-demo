module.exports = function(app){
	var userController = require('./controllers/user')(app)
	, rootcontroller = require('./controllers/root')(app)
	, passportConfig = require('./config/passport-config.js');

	app.get('/',rootcontroller.landing);
	app.get('/users/user',rootcontroller.user);
	app.get('/users/profile',passportConfig.isAuthenticated, rootcontroller.userProfile);
	app.get('/users/homepage',passportConfig.isAuthenticated,rootcontroller.homepage);
	app.get('/users/create',userController.create);
	app.post('/users/authenticate', userController.authenticate);
	app.get('/users/fbauth', userController.startFbAuthentication);
	app.get('/users/fbAuthenticationComplete', userController.onFbAuthenticationComplete);
	app.get('/users/logout', userController.logout);

}