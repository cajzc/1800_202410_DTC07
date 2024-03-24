// mapboxgl.accessToken = 'pk.eyJ1IjoiemFyZmxlY2siLCJhIjoiY2x0dzBlanI5MXF6azJqcXF6cjByNWttdiJ9.fSlamwdtxZGEgeGA9JuDfw';
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style: 'mapbox://styles/mapbox/streets-v12', // style URL
//     center: [-74.5, 40], // starting position [lng, lat]
//     zoom: 9, // starting zoom
// });
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
        mapboxgl: mapboxgl
    });

    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

