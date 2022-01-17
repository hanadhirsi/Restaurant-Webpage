const express = require("express");
const session = require("express-session");
const https = require("https");
const fs = require("fs");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongo");

const app = express();

//importing schemas to store Order and User Data
const User = require("./models/UserModel");
const Order = require("./models/OrderModel");
const Restaurant = require("./models/ResModel");

//Setting up store for session data
const store = new MongoDBStore({
    mongoUrl: "mongodb://localhost/restaurantWebpage",
    collection: "sessions"
})
store.on("error", (error) => {console.log(error)});

//Routers for /users and /orders
const userRouter = require("./routers/userRouter");
const orderRouter = require("./routers/orderRouter");


//Setting middleware
app.set("views");
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.static("public/JS"));
app.use(express.static("public/CSS"));
app.use(express.static("public/Images"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    name: "restaurantWebpage-session",
    secret: "bonus marks plz?",
    cookie:{
        maxAge: 1000*60*60*24*7 // one week's time
    },
    store: store,
    resave: true,
    saveUninitialized: false
}));
//Console log for req method and url
app.use(function(req, res, next){
    console.log(`${req.method} for ${req.url}`);
    console.log(`Session: ${JSON.stringify(req.session)}`);
    next();
});

//Checking login status
app.use(function(req, res, next){
    if(!req.session.loggedIn){
        req.session.loggedIn = false;
        res.locals.session = req.session;
    }

    next();
})

app.use(exposeSession);
// Handler for / (home page)
app.get("/", (req, res) => {res.render("home")});

// Handlers for /login (GET and POST)
app.get("/login", (req, res) => {res.render("login")});
app.post("/login", loginUser);

// Handler for /logout
app.get("/logout", logoutUser);

// Handler for /users
app.use("/users", userRouter);

//Handler for /orders
app.use("/orders", orderRouter);

//Handler for /register
app.get("/register", (req, res) => {res.render("register")});


//Handler for /orderform (ordering page)
app.get("/orderform", auth, (req, res) => {res.render("orderform")});

// Handler for restaurant-names (sending restaurant names to client)
app.get("/restaurant-names", sendResNames);

// Handler for sending menu of selected restaurant
app.get("/restaurant", sendCurrRes)

// Handler function for 404 errors
app.use(function(req, res, next){
    res.status(404).send("Not Found");
})

// Handler for 500 errors (server errors)
app.use(function(err, req, res, next){
    res.status(500).send("Server Error");
})

/**
 * Function: exposeSession
 * Purpose: initializes res.locals.session to access session data through the program easier
 * @param req request from client
 * @param res response from server
 * @param next tells function to continue to next call
 */
function exposeSession(req, res, next){
    if(req.session){
        res.locals.session = req.session;
    }

    next();
}

/**
 * Function: auth
 * Purpose: authorizes whether or not user is logged in, returns 403 status if they are not, calls next function if they are
 * @param req request from client
 * @param res response from server
 * @param next tells function to continue to next call 
 */
function auth(req, res, next){
    if(req.session.loggedIn){
        next();
    }
    else{
        res.status(403).send("Forbidden");
    }
}

/**
 * Function: loginUser
 * Purpose: checks login information of user to see if it matches username and password in the database, returns json saying whether or not login was successful
 * @param req request from client
 * @param res response from server
 */
function loginUser(req, res){
    if(req.session.loggedIn){
        res.send("Already logged in.");
    }
	let user = req.body;
    User.find({username: user.username} , function(err, result){
        if((result.length == 0) || (result[0].password != user.password)){
            res.json({invalid: true});
        }
        else{
            req.session.loggedIn = true;
            req.session.username = result[0].username;
            req.session.userId = result[0].id;
            res.locals.session = req.session;
            res.json({invalid: false, userId: result[0].id});
        }
    });
}

/**
 * Function: logoutUser
 * Purpose: destroys session when user chooses to log out and redirects them to the home page
 * @param req request from client
 * @param res response from server
 */
function logoutUser(req, res){
    req.session.destroy();
    delete res.locals.session;
    res.redirect("/");
}

/**
 * Function: sendResNames
 * Purpose: grabs all restaurants from database to send restaurant names client side
 * @param req request from client
 * @param res response from server
 */
function sendResNames(req, res){
    Restaurant.find(function(err, results){
        if(err) throw err;

        let resNames = [];
        for(let i=0; i < results.length; i++){
            resNames.push(results[i].name);
        }
        console.log(resNames);

        if(req.accepts("json")){
            res.json({restaurants: resNames});
        }
        else{res.status(404).send("Not Found");}  //If url for restaurant names is typed, 404 error will be returned
    })
}

function sendCurrRes(req, res){
    let resName = "";
    if(req.query.name){
        resName = req.query.name;
    }
    console.log(resName);
    Restaurant.find({name: resName}, function(err, result){
        if(err) throw err;


        if(req.accepts("json")){
            res.json(result[0]);
        }
        else{res.status(404).send("Not Found");}  //If url for restaurant names is typed, 404 error will be returned

    })
}





// Connecting mongoose and listening at port 3000
mongoose.connect("mongodb://localhost/restaurantWebpage", {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", function() {
    User.init(() =>{
        https.createServer({
            key: fs.readFileSync("server.key"),
            cert: fs.readFileSync("server.cert")
        }, app).listen(3000 || process.env.PORT, function() {
            console.log("Server running at https://127.0.0.1:3000/");
        })
        
        
    })
})