
function startCommute(user) {
    // Check if the user is logged in:

    commuteID = db.collection("users").doc(user.uid).collection("commutes").doc().id
    var currentUserCommute = db.collection("users").doc(user.uid).collection("commutes");
    currentUserCommute.doc(commuteID).set({
        name: firebase.firestore.Timestamp.now().toDate()
    });

    startLeg(user, commuteID)

    localStorage.setItem("currentCommuteID", commuteID)


    console.log("commute Started")
}

function startLeg(user, commuteID) {
    let legID = localStorage.getItem("currentLegID")
    let legCount = 1
    if (legID != null) {
        legCount = parseInt(legID.slice(3)) + 1
        legID = `leg${legCount}`
    } else {
        legID = "leg1"
    }

    db.collection("users").doc(user.uid).collection("commutes").doc(commuteID).collection("commuteLegs").doc(legID).set({
        startTime: firebase.firestore.Timestamp.now(),
        endTime: firebase.firestore.Timestamp.now(),
        cost: 0,
        method: "walk",
        leg: legCount,
        /*startLocation: navigator.geolocation.getCurrentPosition(),
        endLocation: navigator.geolocation.getCurrentPosition()*/
    })

    localStorage.setItem("currentLegID", legID)

    console.log(legID + " started")

}

function setTransit(user) {
    let transitType = localStorage.getItem("currentCommute")
    let commuteId = localStorage.getItem("currentCommuteID")
    let legId = localStorage.getItem("currentLegID")

    db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs").doc(legId).update({
        method: transitType
    })

    console.log("transit set to " + transitType)

}

function togglePause(user) {

    let pauseID = localStorage.getItem("pauseID")
    let paused = localStorage.getItem("paused")
    let commuteId = localStorage.getItem("currentCommuteID")
    let legId = localStorage.getItem("currentLegID")

    if (pauseID == null)
        pauseID = "pause1"

    if (paused == null) {
        $("#pauseButton").text("play_circle")
        $("#commuteText").text("Your Commute is Paused!")
        localStorage.setItem("paused", 1)

        db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs").doc(legId).collection("pauses").doc(pauseID).set({
            pauseStartTime: firebase.firestore.Timestamp.now(),
            pauseEndTime: firebase.firestore.Timestamp.now()
        })

        localStorage.setItem("pauseID", pauseID)
    } else {
        localStorage.removeItem("paused")
        $("#pauseButton").text("pause_circle")
        writeTime(user)

        db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs").doc(legId).collection("pauses").doc(pauseID).update({
            pauseEndTime: firebase.firestore.Timestamp.now()
        })

        pauseCount = parseInt(pauseID.slice(5)) + 1
        pauseID = `pause${pauseCount}`
        localStorage.setItem("pauseID", pauseID)

    }
}

function writeTime(user) {
    let commuteId = localStorage.getItem("currentCommuteID")

    let currentTime = (firebase.firestore.Timestamp.now().toMillis()) / 1000

    getStartTime(user, commuteId)
    let commuteStartTime = localStorage.getItem("startTime")
    let totalTime = currentTime - commuteStartTime
    let hours = Math.floor(totalTime / 3600)
    let minutes = Math.floor((totalTime - hours * 3600) / 60)
    let seconds = Math.floor((totalTime - hours * 3600) % 60)

    $("#commuteText").html(` 
    You're on the way!<br>Current Time:<br>
    ${hours} hrs, ${minutes} mins, ${seconds} secs
    `)

}

function getStartTime(user, commuteId) {
    commuteLeg = db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs").doc(("leg1"))
    commuteLeg.get().then(firstLeg => {
        let startingTime = firstLeg.data().startTime.toMillis() / 1000
        localStorage.setItem("startTime", startingTime)
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

    let paused = localStorage.getItem("paused")
    console.log(paused)

    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            console.log(currentCommute)

            if (currentCommute == null) {
                startCommute(user)
                localStorage.setItem("currentCommute", "started")
            }

            $("#transferSelect").on("click", () => {
                selectTransfer()
                setTransit(user)
            })


            if (paused != null) {
                $("#pauseButton").text("play_circle")
                $("#commuteText").text("Your Commute is Paused!")
            }

            $("#pauseButton").on("click", () => {
                togglePause(user)
            })

        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })











}


setup()
