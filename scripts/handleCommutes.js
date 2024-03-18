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

    if (paused != null)
        togglePause(user)

    localStorage.removeItem("pauseID")

    let legEndTime = firebase.firestore.Timestamp.now()
    let path = db.collection("users").doc(user.uid).collection("commutes").doc(commuteID).collection("commuteLegs")

    path.doc(legID).update({
        endTime: legEndTime
        /*endLocation: navigator.geolocation.getCurrentPosition()*/
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
            startTime: firebase.firestore.Timestamp.now()
        })

        localStorage.setItem("pauseID", pauseID)

    } else {
        localStorage.removeItem("paused")
        $("#pauseButton").text("pause_circle")

        writeTime(user)

        let path = db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs").doc(legId).collection("pauses")
        let pauseEndTime = firebase.firestore.Timestamp.now()
        path.doc(pauseID).update({
            endTime: pauseEndTime
        })

        getStartTime(pauseID, path, (startTime) => {
            let totalPauseTime = localStorage.getItem("totalPauseTime")
            if (totalPauseTime != null) {
                totalPauseTime += parseFloat((parseFloat(pauseEndTime.toMillis()) / 1000) - parseFloat(startTime))
                localStorage.setItem("totalPauseTime", totalPauseTime)
            } else {
                localStorage.setItem("totalPauseTime", parseFloat((parseFloat(pauseEndTime.toMillis()) / 1000) - parseFloat(startTime)))
            }

            pauseCount = parseInt(pauseID.slice(5)) + 1
            pauseID = `pause${pauseCount}`
            localStorage.setItem("pauseID", pauseID)

        })
    }
}


function endCommute(user, end_commute) {

    let commuteID = localStorage.getItem("currentCommuteID")
    endLeg(user, () => {

        let commuteTime = localStorage.getItem("totalCommuteTime")
        let pauseTime = localStorage.getItem("totalPauseTime")

        commuteTime -= pauseTime

        localStorage.clear()

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

    let currentTime = (firebase.firestore.Timestamp.now().toMillis()) / 1000
    let path = db.collection("users").doc(user.uid).collection("commutes").doc(commuteId).collection("commuteLegs")

    getStartTime("leg1", path, (startTime) => {
        let commuteStartTime = startTime//localStorage.getItem("startTime")
        let totalTime = currentTime - commuteStartTime
        let hours = Math.floor(totalTime / 3600)
        let minutes = Math.floor((totalTime - hours * 3600) / 60)
        let seconds = Math.floor((totalTime - hours * 3600) % 60)

        $("#commuteText").html(` 
    You're on the way!<br>Current Time:<br>
    ${hours} hrs, ${minutes} mins, ${seconds} secs
    `)
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


function setup() {

    let currentCommute = localStorage.getItem("currentCommute")

    let paused = localStorage.getItem("paused")

    firebase.auth().onAuthStateChanged(user => {

        if (user) {
            if (currentCommute == null) {
                startCommute(user, () => {
                    localStorage.setItem("currentCommute", "started")
                })
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

            $("#transferButton").on("click", () => {
                $("#transferButton").hide()
                $("#transferOptions").show()
                endLeg(user, () => {
                    startLeg(user, () => { })
                })
            })

            $("#stopButton").on("click", () => {
                endCommute(user, () => {
                    window.location.href = "../pages/end_commute.html"
                })
            })

        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}


setup()
