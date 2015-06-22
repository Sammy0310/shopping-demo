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
    tpl: Handlebars.compile(
      document.getElementById('admin-dashboard-template').innerHTML
    ),

    render: function () {
      var productlist;
      var that = this;
      this.productlist = new app.ProductList();
      this.productlist.fetch({
        success: function(product) {

           console.log('inside adminDashboard') 
           console.log(product.toJSON())
           // var template = _.template($('#admin-dashboard-template').html()); 
            that.$el.html(this.tpl({products: product.toJSON()}));
        }.bind(this),
        error: function(){
          this.$el.html(template);
        }.bind(this)
      });
      // var template = _.template($('#admin-dashboard-template').html());
      // this.$el.html(template);  
    },

      events: {
        'click #edit' : 'editproduct',
        'click .delete':'deleteproduct'
      },

      deleteproduct:function(ev)
      {
        var val=$(ev.currentTarget).data('id');
        
        var object = new app.ProductList({id: val});
        
        object.destroy({
          success:function(){
          window.location.reload();          
          }
        }) 
        return false;
      }
    });
  
    
  app.createProductView = Backbone.View.extend({
    el: '.page',

    render: function (products) {

      var template = _.template($('#create-product-template').html());
      this.$el.html(template());  
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

  app.editProductView = Backbone.View.extend({
    el: '.page',
    tpl: Handlebars.compile(
      document.getElementById('create-product-template').innerHTML
    ),
    render: function (products) {
      console.log(products)
      console.log('at editProductView')
      var that=this;
      this.products=products//here we have globally assigned products with (this.products) 
      if(products && products.id){
        that.product = new app.ProductList({id:products.id});
        that.product.fetch({
          success: function(product) {
          that.$el.html(that.tpl({product: product.toJSON()}));
         }, 
        error: function() {

        }
        })
      }
      else{
        that.$el.html(that.tpl({product: null}));

      }     
     
    },
    events: {
        'submit .product-add-form': 'editproduct'
    },
    editproduct: function(ev){
      console.log('edit product called')
      var productDetails = $(ev.currentTarget).serializeObject();
      var productEdit = new app.ProductList({id:this.products.id});//point to remember
      console.log(productEdit); 
      productEdit.save(productDetails,{
        success: function(product) {
           app.router.navigate('adminDashboard',{trigger: true});
           console.log('after save product function');
        },      
   
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





