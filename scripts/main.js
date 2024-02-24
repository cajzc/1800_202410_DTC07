function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('User is logged in!')
            console.log(user.displayName)

            document.getElementById('name-goes-here').innerHTML = user.displayName

        } else {
            console.log("User is NOT LOGGED IN!")

        }


    })
}

getNameFromAuth()