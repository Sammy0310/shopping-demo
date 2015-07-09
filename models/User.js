/* Consumer Data */

var bcrypt = require('bcrypt')
,   mongoose = require('mongoose');

var userSchema = mongoose.Schema({

	name: {
		first: {
			type:String,
			required: true,
		},
		last: {
			type: String,
			required: true,
		}
	},
	salt: String,
    hash: String,
	address:[{
	      title:String,
	      vicinity:String,
	      city:String,
	      state:String,
	      zipCode:String	        
	    }],

	email: {
		type:String,
		unique:true,
		required:true
	},
	contactNumber: Number,
	role: {
		type: String,enum: ['Admin','Consumer'],
		required:true,
		default:'Consumer'
		
	},
	facebook:{
		profileId: String,
		displayName: String,
		givenName: String,
		familyName: String,
		emailId: String,
		photo: String,
		accessToken: String
	},
	confirmationToken:String,
	confirmationTokenSentAt: {
		type: Date
	},
	confirmedAt:{
		type:Date
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	updatedAt:{
		type: Date,
		default: new Date(),
	}

});
//virtuals
userSchema
.virtual('password')
.set(function(password){
	this.salt = bcrypt.genSaltSync(10);
	this.hash = bcrypt.hashSync(password,this.salt);
});

userSchema
.virtual('fullname')
.get(function(){
	return this.name.first + ' ' + this.name.last;
})
.set(function (fullname) {
	var split = fullname.split(' ')
	, first = split[0]
	, last = split[1];
 
 this.set('name.first',first);
 this.set('name.last',last);	
})



var User = mongoose.model('User', userSchema);

User.find({role: "Admin"}, function(err, users) {

  if(err) { console.log(err); return err;}

  if(users.length>0) {
    return;
  } else {

    var user = new User();
    user.role = "Admin";
    user.email = "admin@sqrinfotech.com";
    user.contactNumber=9879879798;
    user.set('password', "admin123");
    user.set('fullname', "Super Admin");
    user.set('termsAccepted',true);

    user.save(function(err) {
      if(err) {
       console.log(err);
        return err;
      }

      return;
    })
  };
});

module.exports = mongoose.model('User', userSchema);