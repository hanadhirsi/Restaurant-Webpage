// Event listener for login button to run function for logging in user
document.getElementById("loginButton").addEventListener("click", loginUser);

/**
 * Function: loginUser
 * Purpose: sends a POST request to /login with the username and password given in the textboxes to login user
 */
function loginUser(){

    let userName = document.getElementById("username");
	let userPass = document.getElementById("password");

    let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){

		if(this.readyState === 4 && this.status === 200){
			let validUser = JSON.parse(xhttp.responseText);
            if(validUser.invalid == true){
                alert("Error: Incorrect username or password.");
                userName.value = "";
                userPass.value = "";
            }
            else{
                getUserProfile(validUser.userId);
            }
			
		}
	}

	xhttp.open("POST",`https://127.0.0.1:3000/login`);

	xhttp.setRequestHeader("Content-Type", "application/JSON", true);

	let data = JSON.stringify({username: userName.value, password: userPass.value});
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