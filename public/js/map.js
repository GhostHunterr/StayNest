var map = L.map('map').setView([coordinates[1], coordinates[0]], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([coordinates[1], coordinates[0]])
    .bindPopup("Exact location will be shared after booking.")
    .openPopup()
    .addTo(map);