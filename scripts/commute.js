
function setup() {

    $("#transferOptions").hide()

    let currentCommute = localStorage.getItem("currentCommute")

    if (currentCommute != null && currentCommute != "started") {
        $("#currentCommuteIcon").attr("name", `${currentCommute}`)
        $("#currentCommuteIcon").text(`directions_${currentCommute}`)
    }

    if ($("#currentCommuteIcon").attr("name") == "play") {
        $("#transferButton").hide()
        $("#undoSelectTransfer").hide()
        $("#transferOptions").show()

    }


    // $("#transferSelect").on("click", () => { selectTransfer() })

    $("#stopButton").on("click", () => {
        $("#currentCommuteIcon").attr("name", "play")
        $("#currentCommuteIcon").text("play_circle")
    })

    $("#currentCommuteIcon").on("click", () => {
        if ($("#currentCommuteIcon").attr("name") == "play") {

        }
    })

}


setup()