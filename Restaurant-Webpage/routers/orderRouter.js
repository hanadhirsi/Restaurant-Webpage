const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

//HANDLERS FOR EACH URL PATH AND REQUEST METHOD
router.post("/", addOrder);
router.get("/:orderID", getOrder);



/**
 * Function: addOrder
 * Purpose: adds Order to database when user makes a POST request to /orders
 * @param req request from client
 * @param res response from server
 */
function addOrder(req, res){
    let orderInfo = req.body;          //The order object sent by user

    let orderContents = [];            //array to hold items ordered by user 
    Object.values(orderInfo.order).forEach(item =>{
        orderContents.push(`${item.name} x ${item.quantity}`);
    })


    Order.create({                                    //creating new order object
        restaurantName: orderInfo.restaurantName,
        subtotal: orderInfo.subtotal,
        total: orderInfo.total,
        fee: orderInfo.fee,
        tax: orderInfo.tax,
        contents: orderContents,
        customerID: req.session.userId
    }, function(err){
        if(err) throw err;
        res.send("Order Added to Database.");
    })
}

/**
 * Function: getOrder
 * Purpose: gets order according to id when user makes a GET request for /orders/:orderID, returns 403 error if customer of order is 
 * @param req request from client
 * @param res response from server
 */
function getOrder(req, res){
    let orderId = req.params.orderID;
    if(orderId.length != 24){res.status(404).send("Error, Order not Found.");} // For cases where the user searches with a url that has an invalid ID 
    else{
        Order.findById(orderId, function(err, orderResult){
            if(err) throw err;
            User.findById(orderResult.customerID, function(err, userResult){
                if(err) throw err;
                if(userResult.privacy && (req.session.userId != userResult.id)){         
                    res.status(404).send("Error, Order not found");
                }
                else{
                    res.render("order", {order: orderResult, user: userResult});
                }
            })
        })
    }
    
}


module.exports = router;