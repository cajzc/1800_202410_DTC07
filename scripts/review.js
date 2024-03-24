var currentUser
function populateReviews() {
    const ratingsRef = db.collection("ratings");

    ratingsRef.get().then((querySanpshot) => {
        querySanpshot.forEach((doc) => {
            const data = doc.data();
            const reviewTimestamp = doc.data().timestamp.toDate();

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
                    <p class="text-gray-600">Date: ${reviewTimestamp.toLocaleDateString()}</p>
                </div>
        `;

            document.getElementById("reviewsContainer").innerHTML += reviewBox;
        });
    }).catch((error) => {
        console.error("Error getting reviews: ", error)
    })
}

// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // Fill in clicked star and stars before it
        for (let i = 0; i <= index; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star';
        }
    });
});


function submitReview(reviewSubmitted) {
    commuteID = localStorage.getItem("currentCommuteID");
    const reviewContent = document.getElementById('message').value;
    // Get the star rating
		// Get all the elements with the class "star" and store them in the 'stars' variable
        const stars = document.querySelectorAll('.star');
		// Initialize a variable 'commuteRating' to keep track of the rating count
    let commuteRating = 0;
		// Iterate through each element in the 'stars' NodeList using the forEach method
    stars.forEach((star) => {
				// Check if the text content of the current 'star' element is equal to the string 'star'
        if (star.textContent === 'star') {
						// If the condition is met, increment the 'commuteRating' by 1
                        commuteRating++;
        }
    });

    if (reviewContent.trim() !== '') {

        db.collection('ratings').add({
            commuteID: commuteID,
            review_content: reviewContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            rating: commuteRating
        }).then(() => {
            // Clear textarea after successful submission
            document.getElementById('message').value = '';
            alert('Review submitted successfully!');
            reviewSubmitted();
        }).catch((error) => {
            console.error('Error adding review: ', error);
            alert('An error occurred while submitting the review. Please try again later.');
        });
    } else {
        alert('Please enter a review before submitting.');
    }
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
                    console.log(favorite_Locations)
                    if (favorite_Locations != null && favorite_Locations.length > 0) {
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

    commute_time = localStorage.getItem("finalCommuteTime")

    $("#timeDisplay").html(commute_time)

    $("#submitReview").on("click", () => {
        submitReview(() => {
            localStorage.clear()
            window.location.href = "../pages/review_submitted.html"
        })
    })


}

main();