var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let userSchool = userDoc.data().school;
                    let userCity = userDoc.data().city;
                    let favorite_Locations = userDoc.data().favoriteLocationsList

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (favorite_Locations != null) {
                        favorite_Locations.forEach((faveLocation) => {
                            favoriteLocations.innerHTML += `
                            <div>${faveLocation}<a id="${faveLocation}Fave" onclick="removeFavoriteLocation('${faveLocation}', this)">X</a></div>
                            `
                        })

                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    //enter code here

    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userSchool = document.getElementById('schoolInput').value;     //get the value of the field with id="schoolInput"
    userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"
    //b) update user's document in Firestore
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

function addFavoriteLocation() {
    let faveLocation = favoriteLocation.value

    if (faveLocation == "") {
        alert("Please enter a location")
    } else if ($(`#${faveLocation}Fave`).length != 0) {
        alert("That location is already saved!")
    } else {

        favoriteLocations.innerHTML += `
    <div>${faveLocation}<a id="${faveLocation}Fave" onclick="removeFavoriteLocation('${faveLocation}', this)">X</a></div>
    `
        currentUser.update({
            favoriteLocationsList: firebase.firestore.FieldValue.arrayUnion(faveLocation)
        })
    }

    favoriteLocation.value = null
}

function removeFavoriteLocation(faveLocation, item) {

    item.parentElement.innerHTML = ""
    currentUser.update({
        favoriteLocationsList: firebase.firestore.FieldValue.arrayRemove(faveLocation)
    })

}

//call the function to run it 
populateUserInfo();