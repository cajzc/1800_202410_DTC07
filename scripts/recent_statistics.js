function displayCommuteCards(collection) {
    let cardTemplate = document.getElementById("commuteTemplate")

    db.collection(collection).get()
    .then(allCommutes=> {
        allCommutes.forEach(doc=> {
            var start_location = doc.data().start_location
            var end_location = doc.data().end_location
            var method = doc.data().method

            var start_time = doc.data().start_time.seconds
            var end_time = doc.data().end_time
            var start_time_hour = new Date(start_time * 1000).toLocaleTimeString('default')
            var start_time_date = new Date(start_time).toLocaleDateString("default")
            var end_time = new Date(end_time * 1000).toLocaleTimeString('default')

            let newcard = cardTemplate.content.cloneNode(true)

            newcard.querySelector('#date').innerHTML = start_time_date
            newcard.querySelector('#start_location').innerHTML = start_location
            newcard.querySelector('#end_location').innerHTML = end_location
            newcard.querySelector('#start_time').innerHTML = start_time_hour
            newcard.querySelector('#icon').innerHTML = `<label for="${method}" class="material-symbols-outlined text-4xl peer-checked:bg-accent peer-checked:text-primary p-2 rounded-lg text-background cursor-pointer">directions_${method}</label>`
              
            document.getElementById('commutes-go-here').appendChild(newcard)
        })
    })
}


displayCommuteCards('commutes')