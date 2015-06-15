/* Product Data */

var mongoose = require('mongoose');

var productSchema = mongoose.Schema({

	name: String,
	category:{
		type: String,enum: ['clothing','shoes','sunglasses','handbags','jewelry','books','music'],
		required:true,
		default:
	},
	description: String,
	imageUrl:{
		type: String,
		default: '/images/product.png',
	},
	price:Number,
	stock:{
		type: Number,
		required:true,
		default:0
	},

});

module.exports = mongoose.model('Product', productSchema);