
function populateReviews() {
    const ratingsRef = db.collection("ratings");

    ratingsRef.get().then((querySanpshot) => {
        querySanpshot.forEach((doc) => {
            const data = doc.data();

            const reviewBox = `
                <div class="bg-gray-100 p-4 rounded-lg shadow-md mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-600">${data.userID}</span>
                        <span class="material-symbols-outlined">${data.commuteMethod}</span>
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

populateReviews();