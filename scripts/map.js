mapboxgl.accessToken = 'pk.eyJ1IjoiemFyZmxlY2siLCJhIjoiY2x0dzBlanI5MXF6azJqcXF6cjByNWttdiJ9.fSlamwdtxZGEgeGA9JuDfw';
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-123.115272, 49.283332],
    zoom: 13
});

// Uncomment to add geocoder controll to the map
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
        color: 'orange'
    },
    mapboxgl: mapboxgl,
    placeholder: 'Search for places',
    container: 'geocoder-container'
});


async function update_url(accurateLocation) {
    url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(accurateLocation)}.json?access_token=pk.eyJ1IjoiemFyZmxlY2siLCJhIjoiY2x0dzBlanI5MXF6azJqcXF6cjByNWttdiJ9.fSlamwdtxZGEgeGA9JuDfw`;
    resp = await fetch(url);
    resp_json = await resp.json();
    console.log(resp_json);
    return resp_json;
    }
 

    
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
// console.log(geocoder);

geocoder.on('result', function(e) {
    var userInput = e.result.text; // Get the text inputted by the user
    console.log('User input:', userInput);
    var accessToken = 'pk.eyJ1IjoiemFyZmxlY2siLCJhIjoiY2x0dzBlanI5MXF6azJqcXF6cjByNWttdiJ9.fSlamwdtxZGEgeGA9JuDfw';
    var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(userInput)}.json?access_token=${accessToken}`;
    console.log(url)

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var newUrl = update_url(data.features[0].place_name)
            console.log('Response New:', newUrl);
            
            // Example: Store the response in local storage
            localStorage.setItem('geocoderResponse', JSON.stringify(newUrl));
            console.log('Response saved to local storage');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
