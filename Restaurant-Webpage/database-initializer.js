const fs = require("fs");

let userNames = ["winnifred", "lorene", "cyril", "vella", "erich", "pedro", "madaline", "leoma", "merrill",  "jacquie"];
let users = [];


let restaurants = [];

userNames.forEach(name =>{
	let u = {};
	u.username = name;
	u.password = name;
	u.privacy = false;
	users.push(u);
});

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

fs.readdir("./restaurants", (err, files) => {     // Reading the restaurant in order to store restaurant data in database

    if(err){
        return console.log(err);                                 //returns if there was an error reading directory
    }


    for(let i = 0; i < files.length; i++){                       //for loop adds json objects from json files to restaurant object as values, makes the keys the restaurant ids
        if(files[i].includes(".json")){
            let res = require(`./restaurants/${files[i]}`);

			let r = {};
			r.name = res.name;
			r.min_order = res.min_order;
			r.delivery_fee = res.delivery_fee;
			r.menu = JSON.stringify(res.menu);
            restaurants.push(r);
        }
        
    }


    
	MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
		if(err) throw err;	
	  
		db = client.db('restaurantWebpage');
		
		
		db.listCollections().toArray(function(err, result){
		   if(result.length == 0){
			   db.collection("users").insertMany(users, function(err, result){
				  if(err){
					  throw err;
				  }
				  
				  console.log(result.insertedCount + " users successfully added (should be 10).");
			  });

			  db.collection("restaurants").insertMany(restaurants, function(err, result){
				  if(err){
					  throw err;
				  }
				
				  console.log(result.insertedCount + " restaurants successfully added (should be 3).");
				  client.close();
			  });
			  return;
		   }
		   
		   let numDropped = 0;
		   let toDrop = result.length;
		   result.forEach(collection => {
			  db.collection(collection.name).drop(function(err, delOK){
				  if(err){
					  throw err;
				  }
				  
				  console.log("Dropped collection: " + collection.name);
				  numDropped++;
				  
				  if(numDropped == toDrop){
					  db.collection("users").insertMany(users, function(err, result){
						  if(err){
							  throw err;
						  }
						  
						  console.log(result.insertedCount + " users successfully added (should be 10).");
					  });

					  db.collection("restaurants").insertMany(restaurants, function(err, result){
						  if(err){
							  throw err;
						  }
						
						  console.log(result.insertedCount + " restaurants successfully added (should be 3).");
						  client.close();
					  });
					  
				  }
			  });		
		   });
		});
	  });
     
});

