/* Order Data */

var bcrypt = require('bcrypt')
, mongoose = require('mongoose');

var orderSchema = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }

});

module.exports = mongoose.model('Order',orderSchema);