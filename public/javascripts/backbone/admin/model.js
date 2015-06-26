var app = app || {};

(function () {
	'use strict';
	app.User = Backbone.Model.extend({
    url: '/users/create'
  });

  app.UserLogin = Backbone.Model.extend({
    url: '/users/authenticate'
  });

  app.ProductDetail = Backbone.Model.extend({

    urlRoot:'/users/productdetail'
  });

  app.ProductList = Backbone.Model.extend({

      urlRoot: '/users/productlist'
  });

  // app.ConfirmProduct = Backbone.Model.extend({

  //     urlRoot: '/users/confirmproduct'
  // });

  app.FacebookLogin = Backbone.Model.extend({
    url: '/users/fbauth'
  });  

  app.Logout = Backbone.Model.extend({
    url: '/users/logout'
  });
})();