var app = app || {};

$(function () {
	'use strict';
	
  var navbarView = new app.NavbarView();
  var fullnavbarView = new app.FullNavbarView();
  
	app.router = new app.Router();

	app.router.on('route:createUser',function () {
    var createUserView = new app.CreateUserView();
    createUserView.render();
    navbarView.render();
  });
  
  app.router.on('route:signIn',function () {
    var signInView = new app.SignInView();
    signInView.render();
    navbarView.render();
  });

  

  app.router.on('route:home',function () {
    var homepage = new app.HomepageView();
    homepage.render();
    fullnavbarView.render();
  });

  app.router.on('route:adminDashboard', function() {
    var adminDashboardView = new app.AdminDashboardView();
    adminDashboardView.render();
    fullnavbarView.render();
  });
  
  app.router.on('route:createProduct', function() {
    var createProductView = new app.createProductView();
    createProductView.render();
    fullnavbarView.render();
  });
  
  app.router.on('route:profile',function () {
    var profile = new app.ProfileView();
    profile.render();
    fullnavbarView.render();
  });


  Backbone.history.start();
});









