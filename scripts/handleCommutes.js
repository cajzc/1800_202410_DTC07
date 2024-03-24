function startCommute(user, start_commute) {


    commuteID = db.collection("users").doc(user.uid).collection("commutes").doc().id
    var currentUserCommute = db.collection("users").doc(user.uid).collection("commutes");
    currentUserCommute.doc(commuteID).set({
        name: firebase.firestore.Timestamp.now().toDate()
    });

    localStorage.setItem("currentCommuteID", commuteID)

    startLeg(user, () => {
        start_commute()
    })

}


function startLeg(user, start_leg) {

    let commuteID = localStorage.getItem("currentCommuteID")
    let legID = localStorage.getItem("currentLegID")
    let location = localStorage.getItem("currentPosition")
    let legCount = 1
    if (legID != null) {
        legCount = parseInt(legID.slice(3)) + 1
        legID = `leg${legCount}`
    } else {
        legID = "leg1"
    }

    console.log(commuteID)
    db.collection("users").doc(user.uid).collection("commutes").doc(commuteID).collection("commuteLegs").doc(legID).set({
        startTime: firebase.firestore.Timestamp.now(),
        endTime: firebase.firestore.Timestamp.now(),
        cost: 0,
        method: "walk",
        leg: legCount,
        startLocation: location
    })


    localStorage.setItem("currentLegID", legID)

    start_leg()

}


function setTransit(user) {

    let transitType = localStorage.getItem("currentCommute")
    let commuteId = localStorage.getItem("currentCommuteID")
    let legId = localStorage.getItem("currentLegID")

    db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs").doc(legId).update({
        method: transitType
    })

}


function endLeg(user, end_leg) {

    let legID = localStorage.getItem("currentLegID")
    let paused = localStorage.getItem("paused")
    let commuteID = localStorage.getItem("currentCommuteID")
    let location

    if (paused != null)
        togglePause(user)

    let legEndTime = firebase.firestore.Timestamp.now()
    let path = db.collection("users").doc(user.uid).collection("commutes").doc(commuteID).collection("commuteLegs")

    getLocation(() => {
        location = localStorage.getItem("currentPosition")
        //location = geofire.geohashForLocation(location)
    })

    path.doc(legID).update({
        endTime: legEndTime,
        endLocation: location
    })

    getStartTime(legID, path, (startTime) => {
        let totalPauseTime = localStorage.getItem("totalCommuteTime")
        if (totalPauseTime != null) {
            totalPauseTime += parseFloat(parseFloat(legEndTime.toMillis()) / 1000 - parseFloat(startTime))
            localStorage.setItem("totalCommuteTime", totalPauseTime)
        } else {
            totalPauseTime = parseFloat(parseFloat(legEndTime.toMillis()) / 1000 - parseFloat(startTime))
            localStorage.setItem("totalCommuteTime", totalPauseTime)
        }

        end_leg()
    })

}

function togglePause(user) {

    let paused = localStorage.getItem("paused")
    let commuteId = localStorage.getItem("currentCommuteID")
    let legId = localStorage.getItem("currentLegID")
    let path = db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs")
    let time = firebase.firestore.Timestamp.now()

    if (paused == null) {
        $("#pauseButton").text("play_circle")
        $("#commuteText").text("Your Commute is Paused!")
        localStorage.setItem("paused", 1)

    } else {
        localStorage.removeItem("paused")
        $("#pauseButton").text("pause_circle")

        getPauseStartTime(path, (startTime) => {
            let totalPauseTime = localStorage.getItem("totalPauseTime")
            if (totalPauseTime != null) {
                totalPauseTime = parseFloat(totalPauseTime) + parseFloat((parseFloat(time.toMillis()) / 1000) - parseFloat(startTime))
            } else {
                totalPauseTime = parseFloat((parseFloat(time.toMillis()) / 1000) - parseFloat(startTime))
            }
            localStorage.setItem("totalPauseTime", totalPauseTime)
        })
    }
    path.doc(legId).update({
        pauses: firebase.firestore.FieldValue.arrayUnion(time)
    })
}



function endCommute(user, end_commute) {

    let commuteID = localStorage.getItem("currentCommuteID")
    endLeg(user, () => {

        let commuteTime = localStorage.getItem("totalCommuteTime")
        let pauseTime = localStorage.getItem("totalPauseTime")

        commuteTime -= pauseTime

        db.collection("users").doc(user.uid).collection("commutes").doc(commuteID).update({
            commuteTotalTime: commuteTime
        })

        let hours = Math.floor(commuteTime / 3600)
        let minutes = Math.floor((commuteTime - hours * 3600) / 60)
        let seconds = Math.round((commuteTime - hours * 3600) % 60)
        commuteTime = `${hours} hrs, ${minutes} mins, ${seconds} secs`
        console.log(commuteTime)

        end_commute()

    })

}


function writeTime(user) {

    let commuteId = localStorage.getItem("currentCommuteID")
    let pauseTime = localStorage.getItem("totalPauseTime")
    let paused = localStorage.getItem("paused")

    let currentTime = parseFloat(firebase.firestore.Timestamp.now().toMillis()) / 1000 - pauseTime
    let path = db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs")


    if (paused != 1) {
        getStartTime("leg1", path, (startTime) => {
            let commuteStartTime = startTime
            let totalTime = currentTime - commuteStartTime
            let hours = Math.floor(totalTime / 3600)
            let minutes = Math.floor((totalTime - hours * 3600) / 60)
            let seconds = Math.floor((totalTime - hours * 3600) % 60)

            $("#commuteText").html(` 
    <span class="text-3xl">You're on the way!</span><br>Current Time:<br>
    ${hours} hrs, ${minutes} mins, ${seconds} secs
    `)
        })
    }

}


function getPauseStartTime(path, getPauseTime) {
    path.doc("leg1").get().then(leg => {
        let startingTime = parseFloat(leg.data().pauses[leg.data().pauses.length - 1].toMillis()) / 1000
        getPauseTime(startingTime)
    })
}


function getStartTime(Id, path, get_start_time) {

    commuteLeg = path.doc((Id))
    commuteLeg.get().then(firstLeg => {
        let startingTime = firstLeg.data().startTime.toMillis() / 1000
        get_start_time(startingTime)
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

function getLocation(get_location) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
        get_location()
    } else {
        alert("Geolocation is not supported by this browser.")
    }
}

function savePosition(position) {
    localStorage.setItem("currentPosition", [position.coords.latitude, position.coords.longitude])

}


function setup() {

    let currentCommute = localStorage.getItem("currentCommute")

    let paused = localStorage.getItem("paused")

    firebase.auth().onAuthStateChanged(user => {

        if (user) {
            if (currentCommute == null) {
                getLocation(() => {
                    let location = localStorage.getItem("currentPosition")
                    console.log(location)
                    startCommute(user, () => {

                        localStorage.setItem("currentCommute", "started")
                    })
                    //location = geofire.geohashForLocation(location)
                })

            }

            $("#transferSelect").on("click", () => {
                selectTransfer()
                setTransit(user)
            })

            $("#undoSelectTransfer").on("click", () => {
                $("#transferButton").hide()
                $("#transferOptions").show()
            })

            if (paused != null) {
                $("#pauseButton").text("play_circle")
                $("#commuteText").text("Your Commute is Paused!")
            }

            $("#pauseButton").on("click", () => {
                togglePause(user)
            })

            $("#transferButton").on("click", () => {
                $("#transferButton").hide()
                $("#transferOptions").show()
                endLeg(user, () => {
                    startLeg(user, () => { })
                })
            })

            $("#stopButton").on("click", () => {
                endCommute(user, () => {
                    localStorage.removeItem("currentCommute")
                    window.location.href = "../pages/end_commute.html"
                })
            })

            $(function () {
                setInterval(() => {

                    $("commuteText").load("../pages/write_time.html", writeTime(user))

                }, 1000)
            })



        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}


setup()
