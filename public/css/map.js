// console.log(mapToken)
// console.log(coordinates)
mapboxgl.accessToken = mapToken;
let cordi = coordinates
const map = new mapboxgl.Map({
    container: 'map', // container ID"
    style: "mapbox://styles/mapbox/streets-v12",
    center: cordi,  // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13// starting zoom
});

console.log(coordinates)
const marker = new mapboxgl.Marker({color: '#8230b9' })
.setLngLat(cordi)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML('<h5>Exact location provided after booking</h5>'))
.addTo(map)      