var app = app || {};

(function () {

  app.Router = Backbone.Router.extend({

    routes: {

      '': 'createUser',
      'signin': 'signIn',
      'home': 'home',
      'adminDashboard': 'adminDashboard',     
      'editProduct/:id':'editProduct',
      'buyProduct': 'confirmProduct',
      'productDetail/:id':'detailProduct',
      'createProduct':  'createProduct',
      'profile': 'profile'

     }
  });
 })();