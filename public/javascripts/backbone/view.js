var app = app || {};

(function () {
  'use strict';

  app.CreateUserView = Backbone.View.extend({
        el: '.page',

        render: function () {
          var template = _.template($('#create-user-template').html());
          this.$el.html(template);  
        },
       
        events: {
          'submit .create-user-form': 'saveUser'
        },

        saveUser: function (ev) {
          var userDetails = $(ev.currentTarget).serializeObject();
          var user = new app.User();
          user.save(userDetails, { //here throwing error will depends on the schema of userDetails "unique" fields throw errors
            success: function(user){
              app.router.navigate('signin',{trigger: true});
            },
            error: function (model, response) {
              if(response.responseJSON.error.name === 'MongoError') {
                document.getElementById('register-error-message').innerHTML = 'Email you entered is already registered with the application!';
              }
            }
          });
          return false;
        }
      });

      app.SignInView = Backbone.View.extend({
        el: '.page',

        render: function(){
          var template = _.template($('#login-user-template').html());
          this.$el.html(template);  
        },
        events: {
          'submit .login-user-form': 'login'
        },
        login: function(ev) {
          var loginDetails = $(ev.currentTarget).serializeObject();
          var userLogin = new app.UserLogin();
          userLogin.save(loginDetails, {//here the backbone interact with node by looking into loginDetails Model in backbone's model.js
                                        //from their it is paased to '/users/authenticate' this '/users/authenticate' is handled inside
                                        //"app.post('/users/authenticate', userController.authenticate)" in routes.js    
            success: function(user){
              window.localStorage.setItem('id', user.attributes._id);
              
              if(user.attributes.role === 'admin') {
                app.router.navigate('adminDashboard', {trigger: true});
              } else {
                app.router.navigate('home', {trigger: true});  
              }
              
            },
            error: function (model, response) {
              if(_.isString(response.responseJSON.error)) {
                document.getElementById('error-message').innerHTML = response.responseJSON.error;
              }              
            }
          });
          return false;
        }
      });      

    
  app.HomepageView = Backbone.View.extend({
    el: '.page',

    render: function () {
      var template = _.template($('#homepage-template').html());
      this.$el.html(template);  
    }
  });

  app.AdminDashboardView = Backbone.View.extend({
    el: '.page',

    render: function () {
      var template = _.template($('#admin-dashboard-template').html());
      this.$el.html(template);  
    }
  });

  app.ProfileView = Backbone.View.extend({
    el: '.page',

    render: function () {
      var template = _.template($('#profile-template').html());
      this.$el.html(template);  
    }
  });

  app.NavbarView = Backbone.View.extend({
    el: '.navigation',

    render: function () {
      var template = _.template($('#navbar-template').html());
      this.$el.html(template);  
    }
  });

  app.FullNavbarView = Backbone.View.extend({
    el: '.navigation',

    render: function () {
      var template = _.template($('#full-navbar-template').html());
      this.$el.html(template);  
    },

    events: {
      'click .logout': 'logoutUser'
    },

    logoutUser: function() {
      var userLogout = new app.Logout();
      userLogout.fetch({
        success: function() {
          app.router.navigate('signin', {trigger: true});
        },
        error: function(model, response) {
       
        }
      });
      return false;
    }

  });


})();