var app = app || {};

$(function () {
  'use strict'; 
  
  
  
  
  app.router = new app.Router();
  
  
  app.router.on('route:createUser',function () {
    var createUserView = new app.CreateUserView();
    var navbarView = new app.NavbarView();
    createUserView.render();
    navbarView.render();
  });
  
  app.router.on('route:signIn',function () {
    // if(app.view)
    //     app.view.close();

    var signInView = new app.SignInView();
    var navbarView = new app.NavbarView();
    signInView.render();
    navbarView.render();
  });

  

  app.router.on('route:home',function () {
    if(app.view)
      app.view.close();
    var homepage = new app.HomepageView();
    var fullnavbarView = new app.FullNavbarView();
    homepage.render();
    fullnavbarView.render();
  });

  app.router.on('route:adminDashboard', function() {
    if(app.view)
        app.view.close();
    var adminDashboardView = new app.AdminDashboardView();
    var fullnavbarView = new app.FullNavbarView();
    adminDashboardView.render();
    
    fullnavbarView.render();
  });
  
  app.router.on('route:createProduct', function() {
    if(app.view)
    app.view.close();
    var createProductView = new app.createProductView();
    var fullnavbarView = new app.FullNavbarView();
    createProductView.render();
    fullnavbarView.render();
  });
  
  app.router.on('route:editProduct', function(id) {
    if(app.view)
    app.view.close();
    console.log('at editProduct'+id)
    var editProductView = new app.editProductView();
    var fullnavbarView = new app.FullNavbarView();
    editProductView.render({id: id});
    fullnavbarView.render();
  });

  app.router.on('route:detailProduct',function(id){
    if(app.view)
      app.view.close();
    //console.log('at detailProduct'+id)
    var detailProductView = new app.detailProductView();
    var fullnavbarView = new app.FullNavbarView();
    detailProductView.render({id: id});
    fullnavbarView.render();

  });  

  app.router.on('route:confirmProduct',function(){
    if(app.view)
      app.view.close();
    var confirmProductView = new app.confirmProductView();
    var fullnavbarView = new app.FullNavbarView();
    confirmProductView.render();
    fullnavbarView.render();

  }); 

  Backbone.history.start();
});









