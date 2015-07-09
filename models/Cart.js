var bcrypt = require('bcrypt')
, mongoose = require('mongoose');

var cartSchema = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    details: [{ productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'    
  },
  quantity: {
    type:Number,
    default : 1
  }}]
  
});

module.exports = mongoose.model('Cart',cartSchema);