//Global variable to track save button with the user's id as its id
let saveButton = document.getElementsByTagName("button")[0];

//Event listener for save button to update user privacy setting
document.getElementById(saveButton.id).addEventListener("click", updateUser);
    



/**
 * Function: updateUser
 * Purpose: sends a PUT request to /users/:userID to update privacy settings for user with id userID
 */
function updateUser(){
    let privacyOn = document.getElementById("privacyOn").checked; //Boolean to check if radio button ON for privacy has been checked
    

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){

        if(this.readyState === 4 && this.status === 200){
            alert("Changes saved to server.");
        }
    }

    xhttp.open("PUT",`https://127.0.0.1:3000/users/${saveButton.id}`, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    let data = {private: privacyOn};
    xhttp.send(JSON.stringify(data));  
    
   
}

