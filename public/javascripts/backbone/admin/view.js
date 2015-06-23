var app = app || {};

(function () {
  'use strict';

  Backbone.View.prototype.close = function () {
    //COMPLETELY UNBIND THE VIEW
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.$el.empty();
  };
  app.CreateUserView = Backbone.View.extend({
        el: '.page',

         initialize: function() {
         app.View = this;
         },
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

        initialize: function() {
         app.View = this;
         },

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
    tpl: Handlebars.compile(
      document.getElementById('consumer-template').innerHTML
    ),
    initialize: function() {
         app.View = this;
         },

    render: function () {
         var productlist;
         var that = this;
         this.productlist = new app.ProductList();
         this.productlist.fetch({
          success: function(product) {

            console.log('inside consumerDashboard')
            console.log(product.toJSON())
            that.$el.html(this.tpl({products: product.toJSON()}));
          }.bind(this)
         }); 
         // this.$el.html(this.tpl());
    }
 
  });
/****************************************************************/
  app.AdminDashboardView = Backbone.View.extend({
    el: '.page',
    tpl: Handlebars.compile(
      document.getElementById('admin-dashboard-template').innerHTML
    ),
    initialize: function() {
         app.View = this;
         },

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
    tpl: Handlebars.compile(
      document.getElementById('create-product-template').innerHTML
    ),
    initialize: function() {
         app.View = this;
         },

    render: function () {

         this.$el.html(this.tpl());
    },
    events: {
          'submit .add-product-form': 'addproduct'
        },
        addproduct: function(ev) {
          var productDetails = $(ev.currentTarget).serializeObject();
          var product = new app.ProductList();
          console.log('Inside Add product')
          console.log(productDetails)
          product.save(productDetails, {
            success: function(product){      
                // window.localStorage.setItem('id', product.attributes._id);        
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

    initialize: function() {
         app.View = this;
         },

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
        'submit .add-product-form': 'editproduct'
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
/*******************************Product Detail View*********************************/
//detailProductView
app.detailProductView = Backbone.View.extend({
    el: '.page',
    tpl: Handlebars.compile(
      document.getElementById('product-description-template').innerHTML
    ),

    initialize: function() {
         app.View = this;
         },

    render: function (products) {
     
      console.log('at detailProductView')
      var that=this;
      this.products=products//here we have globally assigned products with (this.products) 
      if(products && products.id){
        that.product = new app.ProductDetail({id:this.products.id});
        that.product.fetch({
          success: function(product) {
            console.log(product)
          that.$el.html(that.tpl({product: product.toJSON()}));
         }, 
        error: function() {
          console.log('error in detailProductView')
        }
        })
      }
      else{
        console.log('else part in detailProductView')
        that.$el.html(that.tpl({product: null}));

      }     
     
    },
    // events: {
    //     'click .add-product-form': 'editproduct'
    // },
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


/**********************************************************************************/
  
  app.NavbarView = Backbone.View.extend({
    el: '.navigation',

    initialize: function() {
         app.View = this;
         },

    render: function () {
      var template = _.template($('#navbar-template').html());
      this.$el.html(template);  
    }
  });

  app.FullNavbarView = Backbone.View.extend({
    el: '.navigation',

    initialize: function() {
         app.View = this;
         },
         
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





