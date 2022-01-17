const mongoose = require("mongoose");
const User = require("./UserModel");
const Schema = mongoose.Schema;

/**
 * OrderSchema to store orders in database
 * orders contain all regular order info (tax, total, name, etc.) and the id of the user that purchased
 */
let orderSchema = Schema({

    restaurantName: {type: String, required: true,},
    subtotal: {type: Number, required: true},
    total: {type: Number, required: true},
    fee: {type: Number, required: true},
    tax: {type: Number, required: true},
    contents: [String],
    customerID: {type: String, required: true}

	
});

module.exports = mongoose.model("Order", orderSchema);