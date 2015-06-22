var app = app || {};

(function () {

  app.Router = Backbone.Router.extend({

    routes: {

      '': 'createUser',
      'signin': 'signIn',
      'home': 'home',
      'adminDashboard': 'adminDashboard',     
      'editProduct/:id':'editProduct',
      'createProduct':  'createProduct',
      'profile': 'profile'

     }
  });
 })();