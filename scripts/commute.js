
function setup() {

    $("#transferOptions").hide()

    let currentCommute = localStorage.getItem("currentCommute")
    console.log(currentCommute)

    if (currentCommute != null && currentCommute != "started") {
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

    // $("#transferSelect").on("click", () => { selectTransfer() })

    $("#stopButton").on("click", () => {
        localStorage.removeItem("currentCommute")
        $("#currentCommuteIcon").attr("name", "play")
        $("#currentCommuteIcon").text("play_circle")
    })

    $("#currentCommuteIcon").on("click", () => {
        if ($("#currentCommuteIcon").attr("name") == "play") {

        }
    })

}


setup()