mapboxgl.accessToken = 'pk.eyJ1IjoiemFyZmxlY2siLCJhIjoiY2x0dzBlanI5MXF6azJqcXF6cjByNWttdiJ9.fSlamwdtxZGEgeGA9JuDfw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
});
