
function startCommute() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            commuteID = db.collection("users").doc(user.uid).collection("commutes").doc().id
            var currentUserCommute = db.collection("users").doc(user.uid).collection("commutes");
            currentUserCommute.doc(commuteID).set({
                name: firebase.firestore.Timestamp.now().toDate()
            });

            legID = currentUserCommute.doc(commuteID).collection("commuteLegs").doc().id

            currentUserCommute.doc(commuteID).collection("commuteLegs").doc(legID).set({
                startTime: firebase.firestore.Timestamp.now(),
                endTime: firebase.firestore.Timestamp.now(),
                pauseStartTime: 0,
                pauseEndTime: 0,
                cost: 0,
                method: "walk",
                /*startLocation: navigator.geolocation.getCurrentPosition(),
                endLocation: navigator.geolocation.getCurrentPosition()*/


            })

            localStorage.setItem("currentCommuteID", commuteID)
            localStorage.setItem("currentLegID", legID)

        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

function setTransit() {
    let transitType = localStorage.getItem("currentCommute")
    let commuteId = localStorage.getItem("currentCommuteID")
    let legId = localStorage.getItem("currentLegID")
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs").doc(legId).update({
                method: transitType
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

function selectTransfer() {
    if ($("#bus").is(":checked")) {
        $("#currentCommuteIcon").attr("name", "bus")
        $("#currentCommuteIcon").text("directions_bus")
        localStorage.setItem("currentCommute", "bus")
    }
    if ($("#car").is(":checked")) {
        $("#currentCommuteIcon").attr("name", "car")
        $("#currentCommuteIcon").text("directions_car")
        localStorage.setItem("currentCommute", "car")
    }
    if ($("#subway").is(":checked")) {
        $("#currentCommuteIcon").attr("name", "subway")
        $("#currentCommuteIcon").text("directions_subway")
        localStorage.setItem("currentCommute", "subway")
    }
    if ($("#boat").is(":checked")) {
        $("#currentCommuteIcon").attr("name", "boat")
        $("#currentCommuteIcon").text("directions_boat")
        localStorage.setItem("currentCommute", "boat")
    }
    if ($("#walk").is(":checked")) {
        $("#currentCommuteIcon").attr("name", "walk")
        $("#currentCommuteIcon").text("directions_walk")
        localStorage.setItem("currentCommute", "walk")
    }
    if ($("#bike").is(":checked")) {
        $("#currentCommuteIcon").attr("name", "bike")
        $("#currentCommuteIcon").text("directions_bike")
        localStorage.setItem("currentCommute", "bike")
    }
    $("#transferButton").show()
    $("#transferOptions").hide()
}


function setup() {
    let currentCommute = localStorage.getItem("currentCommute")
    console.log(currentCommute)

    if (currentCommute == null) {
        startCommute()
        localStorage.setItem("currentCommute", "started")
        console.log("weve gone")
    }

    $("#transferSelect").on("click", () => {
        selectTransfer()
        setTransit()
    })
}


setup()
