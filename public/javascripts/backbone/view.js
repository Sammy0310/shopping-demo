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
          console.log("In submit");
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
          userLogin.save(loginDetails, {
            success: function(user){
              window.localStorage.setItem('id', user.attributes._id);
              
              if(user.attributes.role === 'Admin') {
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
      var productlist;
      var that = this;
      this.productlist = new ProductList();
      this.productlist.fetch({
        success: function(product) {
          this.$el.html(this.tpl({products:product.toJSON()}));
        }.bind(this),
        error: function(){
          this.$el.html(this.tpl);
        }.bind(this)
      });
      // var template = _.template($('#admin-dashboard-template').html());
      // this.$el.html(template);  
    },

      events: {
        'click #productdelete':'deleteproduct'
      },

      deleteproduct:function(ev)
      {
        var val=$(ev.currentTarget).data('org');
        
        var object=new ProductList({id:val});
        
        object.destroy({
          success:function(){
          $(ev.currentTarget).closest('tr').remove();
          
          },
          error:function()
          {
          }
        });
      }
    });

  
    
  app.createProductView = Backbone.View.extend({
    el: '.page',

    render: function () {
      var template = _.template($('#create-product-template').html());
      this.$el.html(template({products:}));  
    },
    events: {
          'submit .product-add-form': 'addproduct'
        },
        addproduct: function(ev) {
          var productDetails = $(ev.currentTarget).serializeObject();
          var product = new app.ProductAdd();
          console.log('Inside Add product')
          console.log(productDetails)
          product.save(productDetails, {
            success: function(user){      
                window.localStorage.setItem('id', product.attributes._id);        
                app.router.navigate('adminDashboard', {trigger: true});              
                       
            },
            error: function (model, response) {
              // if(_.isString(response.responseJSON.error)) {
              //   document.getElementById('error-message').innerHTML = response.responseJSON.error;
              // }              
            }
          });
          return false;
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
          console.log('In success file')
          app.router.navigate('signin', {trigger: true});
        },
        error: function(model, response) {
          console.log('In error file')
        }
      });
      return false;
    }

  });


})();