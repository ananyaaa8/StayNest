mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates,
    zoom: 9 
});

const marker = new mapboxgl.Marker({color:"black"})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML(
        `<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`))
.addTo(map);

console.log("Listing geometry:", listing.geometry);
console.log("Map token:", mapToken);