// Event Listener to see if register button was clicked 
document.getElementById("createUser").addEventListener("click", createNewUser);

/**
 * Function: createNewUser
 * Purpose: sends GET request for /users to get names of all users and compare them with new user being created, alerts user if their username is a duplicate or if username or password is blank
 */
function createNewUser(){
	let newUserName = document.getElementById("username");
	let newUserPassword = document.getElementById("password");

    let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){

		if(this.readyState === 4 && this.status === 200){
			console.log("asd;lkjfa;");
			let userObject = JSON.parse(xhttp.responseText);
            let userArray = userObject.users;
			let duplicateName = false;
			
			for(let i=0; i < userArray.length; i++){
				if(userArray[i].username == newUserName.value.replace(/ /g, "")){
					duplicateName = true;
				}
				
			}

			if(duplicateName){
				alert("Error: that username is already taken");
				newUserName.value = "";
				newUserPassword.value = "";
			}
			else if(newUserName.value.replace(/\s+/g, '') == '' || newUserPassword.value.replace(/\s+/g, '') == ''){
				alert("Error: Please enter a username and password");
				newUserName.value = "";
				newUserPassword.value = "";
			}
			else{
				console.log(newUserName.value);
				sendUser(newUserName.value, newUserPassword.value);
			}

		}

		
	}

	xhttp.open("GET", `https://127.0.0.1:3000/users`);
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send();
}

/**
 * Function: sendUser
 * Purpose: sends user to server in a POST request to /users to have user to the user databse
 */
function sendUser(username, password){
	let userinfo = {}
	userinfo.name = username;
	userinfo.pass = password;
	userinfo.isNew = true;
	console.log(JSON.stringify(userinfo));

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){

		if(this.readyState === 4 && this.status === 200){
			let currUser = JSON.parse(xhttp.responseText);
			console.log(JSON.stringify(currUser));
			getUserProfile(currUser.userId);
			
		}
	}

	xhttp.open("POST",`https://127.0.0.1:3000/users`);

	xhttp.setRequestHeader("Content-Type", "application/JSON", true);

	let data = JSON.stringify(userinfo);
	xhttp.send(data);

}

/**
 * Function: getUserProfile
 * Purpose: redirects current window to the current user's profile page 
 * @param id: id of given user 
 */
function getUserProfile(id){
	window.location = `https://127.0.0.1:3000/users/${id}`;
}