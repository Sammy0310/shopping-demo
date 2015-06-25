
module.exports = function(app){
	var root = {};

	root.landing = function(req,res){
		return res.render('landing/landing');
	};

	root.user = function(req,res){
		return res.render('users/users');
	};

	root.homepage = function(req,res){
		return res.render('users/homepage');
	};

	root.userProfile = function(req,res){
		return res.render('users/userProfile');		
	};

	

	root

	return root;
};

