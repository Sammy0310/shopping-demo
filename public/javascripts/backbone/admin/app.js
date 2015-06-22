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
    if(app.view)
        app.view.close();

    var signInView = new app.SignInView();
    signInView.render();
    navbarView.render();
  });

  

  app.router.on('route:home',function () {
    if(app.view)
        app.view.close();
    var homepage = new app.HomepageView();
    homepage.render();
    fullnavbarView.render();
  });

  app.router.on('route:adminDashboard', function() {
    if(app.view)
        app.view.close();
    var adminDashboardView = new app.AdminDashboardView();
    adminDashboardView.render();
    fullnavbarView.render();
  });
  
  app.router.on('route:createProduct', function() {
    if(app.view)
        app.view.close();
    var createProductView = new app.createProductView();
    createProductView.render();
    fullnavbarView.render();
  });
  
  app.router.on('route:editProduct', function(id) {
    if(app.view)
        app.view.close();
    console.log('at editProduct'+id)
    var editProductView = new app.editProductView();
    editProductView.render({id: id});
    fullnavbarView.render();
  });
  

  Backbone.history.start();
});









