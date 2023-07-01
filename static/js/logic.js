let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Link to GeoJSON data.
let geoData = "https://data.sfgov.org/resource/6ia5-2f8k.geojson"; 


// Getting the GeoJSON data
d3.json(geoData).then(function(data){

  // Creating GeoJSON layer.
  L.geoJson(data).addTo(myMap);
});
