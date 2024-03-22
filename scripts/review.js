var currentUser
function populateReviews() {
    const ratingsRef = db.collection("ratings");

    ratingsRef.get().then((querySanpshot) => {
        querySanpshot.forEach((doc) => {
            const data = doc.data();

            const reviewBox = `
                <div class="bg-gray-100 p-4 rounded-lg shadow-md mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-600">${data.userID}</span>
                        <!-- <span class="material-symbols-outlined">${data.commuteMethod}</span> -->
                    </div>
                    <p class="text-gray-800">${data.review_content}</p>
                    <!-- <p class="text-gray-800">Starting Point: ${data.startingPoint}</p> -->
                    <!-- <p class="text-gray-800">Ending Point: ${data.endingPoint}</p> -->
                    <!-- <p class="text-gray-800">Taken time: ${data.date}</p> -->
                    <p class="text-gray-600">Rating: ${data.rating}</p>
                    <p class="text-gray-600">Date: ${data.date}</p>
            </div>
        `;

            document.getElementById("reviewsContainer").innerHTML += reviewBox;
        });
    }).catch((error) => {
        console.error("Error getting reviews: ", error)
    })
}


function submitReview(reviewSubmitted) {
    commuteID = localStorage.getItem("currentCommuteID")

    //code goes here


    reviewSubmitted()
}

function loadUser() {

    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    let favorite_Locations = userDoc.data().favoriteLocationsList
                    if (favorite_Locations != null) {
                        favorite_Locations.forEach((faveLocation) => {
                            destination.innerHTML += `
                            <option value="${faveLocation}" id="${faveLocation}Fave">${faveLocation}</option>
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


function addFavoriteLocation() {
    console.log(destination.value)
    if (destination.value == "addMore") {
        faveLocation = prompt("Please enter a location name")
        if (faveLocation == "" || faveLocation == null) {
            alert("Please enter a location")
            destination.value = ""
        } else if ($(`#${faveLocation}Fave`).length != 0) {
            alert("That location is already saved!")
            destination.value = ""
        } else {
            currentUser.update({
                favoriteLocationsList: firebase.firestore.FieldValue.arrayUnion(faveLocation)
            })
            destination.innerHTML += `
                            <option value="${faveLocation}" id="${faveLocation}Fave">${faveLocation}</option>
                            `
            destination.value = faveLocation
        }

    }
}


function main() {
    loadUser();
    populateReviews();

    $("#submitReview").on("click", () => {
        submitReview(() => {
            localStorage.clear()
            window.location.href = "../pages/review_submitted.html"
        })
    })


}

main();