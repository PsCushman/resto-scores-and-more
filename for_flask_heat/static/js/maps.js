// Create the map
var map = L.map('map').setView([37.770725811598936, -122.4444875079379], 12); // Set the initial center and zoom level

// Add a tile layer to the map
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map data &copy; OpenStreetMap contributors, Tiles &copy; Stamen',
    subdomains: 'abcd',
    ext: 'png'
}).addTo(map);

// Create an empty array to store the heatmap data
var heatmapData = [];

// Loop through the restaurants data and add coordinates to the heatmap data array
restaurants.forEach(function (restaurant) {
  var lat = parseFloat(restaurant.business_latitude);
  var lon = parseFloat(restaurant.business_longitude);

  // Check if latitude and longitude are valid numbers
  if (!isNaN(lat) && !isNaN(lon)) {
    heatmapData.push([lat, lon]);
  }
});

console.log(heatmapData)

var heat = L.heatLayer(heatmapData, {
  radius: 90,
  blur: 45,
  opacity: 0.8 // Adjust the opacity value as desired
}).addTo(map);

// // Add the color gradient legend to the map
// var legend = L.control({ position: 'bottomright' });
// legend.onAdd = function (map) {
//   var div = L.DomUtil.get('legend');
//   return div;
// };
// legend.addTo(map);
  

  
  

