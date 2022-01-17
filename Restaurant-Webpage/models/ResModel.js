const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * resSchema to store restaurants in the database
 * contains restaurant name, minimum order price, delivery fee, and menu
 */
let resSchema = Schema({

	name: {type: String, required: true,},
    min_order: {type: Number, required: true},
    delivery_fee: {type: Number, required: true},
    menu: {type: String, required: true,}

    
	
});

module.exports = mongoose.model("Restaurant", resSchema);