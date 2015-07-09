  var app = app || {};

  (function () {
    'use strict';

    Backbone.View.prototype.close = function () {
      //COMPLETELY UNBIND THE VIEW
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.$el.empty();
      return this;
    };
    app.CreateUserView = Backbone.View.extend({
          el: '.page',
          tpl: Handlebars.compile(
              document.getElementById('create-user-template').innerHTML
          ),         

           initialize: function() {
           
           app.view = this;
           },
          render: function () {
            this.$el.html(this.tpl());  
          },
         
          events: {
            'submit .create-user-form': 'saveUser'
          },

          saveUser: function (ev) {
            var userDetails = $(ev.currentTarget).serializeObject();// this action is done when we want to send the details for a form submit in JSON format
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
          tpl: Handlebars.compile(
              document.getElementById('login-user-template').innerHTML
            ),
          initialize: function() {
                 app.View = this;
                 },
          render: function(){
            this.$el.html(this.tpl());
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

              that.$el.html(this.tpl({products: product.toJSON()}));
            }.bind(this),
            error: function(model, response) {
            if(response.status == 401)
              app.router.navigate('signin', {trigger: true}); 
            }
           }); 
           
      }
   
    });
  /****************************************************************/
    app.AdminDashboardView = Backbone.View.extend({
      el: '.page',
      tpl: Handlebars.compile(
        document.getElementById('admin-dashboard-template').innerHTML
      ),
      initialize: function() {
           console.log('Inside initialize of AdminDashboardView') 
           app.view = this;
           },

      render: function () {
        var productlist;
        var that = this;
        this.productlist = new app.ProductList();
        this.productlist.fetch({
          success: function(product) {

             console.log('inside adminDashboard') 
             console.log(product.toJSON())
             
              that.$el.html(this.tpl({products: product.toJSON()}));
          }.bind(this),
          error: function(){
            this.$el.html(template);
          }.bind(this)
        });
        
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

            app.view = this;
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
            product.save(productDetails, {
              success: function(product){      
                  app.router.navigate('adminDashboard', {trigger: true});              
                         
              },
              error: function (model, response) {
                            if(response.status == 401)
                              app.router.navigate('signin', {trigger: true});                           

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
           console.log('Inside initialize of editProductView')
           app.view = this;
          
           },

      render: function (products) {
       
        var that=this;
        this.products=products//here we have globally assigned products with (this.products) 
        if(products && products.id){
          that.product = new app.ProductList({id:products.id});
          that.product.fetch({
            success: function(product) {
            that.$el.html(that.tpl({product: product.toJSON()}));
           }, 
          error: function (model, response) {
                        if(response.status == 401)
                          app.router.navigate('signin', {trigger: true}); 
          }

          });
        }
        else{
          that.$el.html(that.tpl({product: null}));

        }     
       
      },
      events: {
          'submit .add-product-form': 'editproduct'
      },
      editproduct: function(ev){
        var productDetails = $(ev.currentTarget).serializeObject();
        var productEdit = new app.ProductList({id:this.products.id});//point to remember
           productEdit.save(productDetails,{
          success: function(product) {
             app.router.navigate('adminDashboard',{trigger: true});
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
           app.view = this;
           },

      render: function (options) {
       
        var that=this;
        this.products=options;//here we have globally assigned products with (this.products) 
        if(options && options.id){
          that.product = new app.ProductDetail({id:options.id});
          that.product.fetch({
            success: function(product) {
            that.$el.html(that.tpl({product: product.toJSON()}));
           }, 
          error: function (model, response) {
                        if(response.status == 401)
                         app.router.navigate('signin', {trigger: true}); 
          }

          });

        }
        else{
          console.log('else part in detailProductView')
          that.$el.html(that.tpl({product: null}));
          }     
       
      },
       events: {
           'click .buy': 'buyproduct'
         },

         buyproduct: function(ev){
        console.log('edit product called')
      
        var term = $('#quantid').val();//here we are bringing the input value from Html through the id='quantid'
        console.log(term)
        var productBuy = new app.ProductDetail({id:this.products.id});//point to remember
        console.log(productBuy); 
        productBuy.save({quantid: term},{
          success: function(product) {
             app.router.navigate('confirmProduct', {trigger: true});
             console.log('after save product function');
          },      
     
        });
        return false;   
      }   

    });


  app.confirmProductView = Backbone.View.extend({

    el: '.page',
    tpl: Handlebars.compile(
        document.getElementById('confirm-product-template').innerHTML
      ),
    initialize: function() {
           console.log('Inside initialize of confirmProductView') 
           app.view = this;
           },
    render: function(){
      this.$el.html(this.tpl());
    }       

  });


  /**********************************************************************************/
    
    app.NavbarView = Backbone.View.extend({
      el: '.navigation',
      tpl: Handlebars.compile(
        document.getElementById('navbar-template').innerHTML
      ),

      initialize: function() {
           app.View = this;
           },

      render: function () {
        this.$el.html(this.tpl());  
      }
    });

    app.FullNavbarView = Backbone.View.extend({
      el: '.navigation',
      tpl: Handlebars.compile(
        document.getElementById('full-navbar-template').innerHTML
      ),

      initialize: function() {
           app.navbarView = this;
           },
           
      render: function () {
        this.$el.html(this.tpl());        
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
            console.log('In error file')
          }
        });
        return false;
      }

    });

   })();





