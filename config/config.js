module.exports = {
	development: {
		siteUrl: 'http://localhost:3000',
		dbUrl: 'mongodb://localhost/shoppingdemo_development',
		monqDbUrl: 'mongodb://localhost/queue_development'
	},
	production: {
		dbUrl: 'mongodb://localhost/shoppingdemo_development',
		monqDbUrl: 'mongodb://localhost/queue_development'
	},
	messages:{
		signOut:'You have successfully signed out!',
		userNotFound:'User Not Found'
	}

};