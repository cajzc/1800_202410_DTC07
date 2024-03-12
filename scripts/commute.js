
function setup() {
    console.log("Hello Commuter")
    $("#transferOptions").hide()

    let currentCommute = localStorage.getItem("currentCommute")
    console.log(currentCommute)

    if (currentCommute != null) {
        $("#currentCommuteIcon").attr("name", `${currentCommute}`)
        $("#currentCommuteIcon").text(`directions_${currentCommute}`)
    }

    if ($("#currentCommuteIcon").attr("name") == "play") {
        $("#transferButton").hide()
        $("#transferOptions").show()
        console.log("commute hasnt started")
    }

    $("#transferButton").on("click", () => {
        console.log("trasnfer clicked")
        $("#transferButton").hide()
        $("#transferOptions").show()
    })

    $("#transferSelect").on("click", () => { selectTransfer() })

    $("#stopButton").on("click", () => {
        localStorage.removeItem("currentCommute")
        $("#currentCommuteIcon").attr("name", "play")
        $("#currentCommuteIcon").text("play_circle")
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

setup()