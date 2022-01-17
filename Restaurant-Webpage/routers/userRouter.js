const express = require("express");
const Order = require("../models/OrderModel");
const router = express.Router();
const User = require("../models/UserModel");



//HANDLERS FOR EACH URL PATH AND REQUEST METHOD
router.get("/", findUsers);
router.post("/", createUser);
router.get("/:userID", loadUserProfile);
router.put("/:userID", updateUserProfile);;

/**
 * Function: findUsers
 * Purpose: Searches the database and finds users according to the query paramaters specified for name when a GET request is made for /users. returns json and html
 * @param req request from client
 * @param res response from server
 */
function findUsers(req, res){
    let name = "";
    let foundUsers = [];                            // array for users that match query param name
    let userName = "";
    if(req.query.name){
        name = req.query.name.toLowerCase();        //Sets query param to lower case 
    }
    User.find(function(err, results){

        for(let i=0; i < results.length; i++){
            userName = results[i].username.toLowerCase();   //Sets username to lowercase to ignore case fully when comparing name query
            if(userName.includes(name)){
                foundUsers.push(results[i]);
            }
            
        }

        if(req.accepts("html")){ 
            res.render("users", {users: foundUsers});
        }
        else if(req.accepts("json")){
            res.json({users: foundUsers});
        }
        else{res.status(406).send("Not Acceptable");} //Returns this error if Accept type is not json or html
    });
    
}


/**
 * Function: createUser
 * Purpose: creates a user to add to database using info sent from client when request is made to POST /users
 * @param req request from client
 * @param res response from server
 */
function createUser(req, res){
    let user = req.body;
    User.create({username: user.name, password: user.pass, privacy: false}, function(err, newInstance){
        if(err) throw err;
        req.session.loggedIn = true;
        req.session.username = user.name;
        req.session.userId = newInstance.id;
        res.locals.session = req.session;
        res.json({userId: newInstance.id});
    })

}

/**
 * Function: loadUserProfile
 * Purpose: loads the profile of the user with the id param given in the URL for GET /users/:userID
 * @param req request from client
 * @param res response from server
 */
function loadUserProfile(req, res){

    let userID = req.params.userID;
    if(userID.length != 24){res.status(404).send("Error, User not Found.");} // For cases where the user searches with a url that has an invalid ID 
    else{
        User.findById(userID, function (err, userResult){
            if(err) throw err;
            if(userResult == []){res.status(404).send("Error, User not Found");}
            else{
                Order.find({customerID: userResult.id}, function(err, orderResult){
                    if(err) throw err;
        
                    if(userResult.privacy == true && req.session.userId != userResult.id){  //If the profile of the user is private, 403 error message is sent back to client
                        res.status(404).send("Error, User not Found");
                    }
                    else{
                        res.render("userProfile", {user: userResult, orders:orderResult});
                    }
                })
            }
            
            
            
        })

    }
    
    
    
}

/**
 * Function: updateUserProfile
 * Purpose: updates the user's profile to private or public when sent a PUT request to /users/:userID of given user
 * @param req request from client
 * @param res response from server
 */
function updateUserProfile(req, res){
    let userID = req.params.userID; 
    User.findById(userID, function (err, result){
        if(err) throw err;
        if(req.body.private){        //Changes privacy to true if user saved with privacy on
            result.privacy = true;
            result.save(function(err){
                if(err) throw err;
                console.log("User now Private");
                res.send();
            })
        }
        else{                      //Changes to public if user checked privacy off
            result.privacy = false;
            result.save(function(err){
                if(err) throw err;
                console.log("User now Public");
                res.send();
            })
        }
    });
   
    
}



module.exports = router;