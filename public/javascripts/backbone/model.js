var app = app || {};

(function () {
	'use strict';
	app.User = Backbone.Model.extend({
    url: '/users/create'
  });

  app.UserLogin = Backbone.Model.extend({
    url: '/users/authenticate'
  });

  app.ProductAdd = Backbone.Model.extend({

    url:'/users/addproduct'
  });

  app.ProductList = Backbone.Model.extend({

    url:'/users/productlist'
  });

  app.FacebookLogin = Backbone.Model.extend({
    url: '/users/fbauth'
  });  

  app.Logout = Backbone.Model.extend({
    url: '/users/logout'
  });
})();