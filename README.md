Author: Hanad Hirsi 

Purpose: The purpose of this program is to create a web application for ordering
from multiple restaurants that stores its users, user order information, 
and session information in a database instead of in RAM. The program keeps track
of the sessions, checking if a user is logged in or not or if their page is private
or public and grants access to certain pages depending on those factors.


Design Choices: When creating this program, I decided to create two seperate
routers, one to handle the /users URL path and one for /orders. For /users, 
a GET request can be made for all users or for a single user (using userID as
a parameter) and it will load either a profile page if it is for one user, or 
a list of all public users that can be accessed. a POST for /users adds a user
to the database and a PUT to /users/userID updates privacy information of the 
given user. For /orders, a POST request to that URL adds an order to the database
and a GET to /orders/:orderID gets a single order.

Source Files:
	JS files: 
		Client Side: login.js, orderform.js, register.js userProfile.js
		Routers: orderRouter.js, userRouter.js
		Schemas: OrderModel.js, UserModel.js
		Sever: server.js
		Databse Initializer: database-initializer.js
	
	PUG files: navheader.pug, home.pug, login.pug, register.pug, order.pug
		   orderform.pug, users.pug, userProfile.pug
		   

	JSON files: package-lock.json, package.json
	
	PNG files: add.png, remove.png

	CSS files: orderform.css

Packages Required:
This program makes use of pug, express, express-session, mongodb, mongoose,
and connect-mongo



Execution Intructions: 
To run this program, Make sure that you have opened the mongo daemon and the mongo
client and that you have a file to store the database. Then, run the
database-initializer.js file to initialize the 3 collections for users, sessions,
and orders. then, run the server.js file and put the link http://127.0.0.1:3000
in your browser of choice to be brought to the home page.
