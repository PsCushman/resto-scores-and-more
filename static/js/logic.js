let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the API query variables.
let geoData = "https://data.sfgov.org/resource/6ia5-2f8k.geojson"; 

let geojson;
// Fetch the GeoJSON data
fetch(geoData)
  .then(response => response.json())
  .then(data => {
    // Create a choropleth layer based on the GeoJSON data
    geojson = L.choropleth(data, {
      valueProperty: 'Nob Hill', // Replace 'property_name' with the actual property name in your GeoJSON data that represents the values for the choropleth
      scale: ["#ffffb2", "#b10026"], // Define the colors for the choropleth scale
      steps: 5, // Define the number of color steps or ranges
      mode: 'q', // Define the mode for determining the color ranges ('q' for quantile, 'e' for equidistant, or 'k' for k-means clustering)
      style: {
        color: '#fff', // Border color for the choropleth polygons
        weight: 1, // Border weight for the choropleth polygons
        fillOpacity: 0.8 // Opacity for the choropleth polygons
      },
      onEachFeature: function(feature, layer) {
        // Add any desired interaction or information for each choropleth polygon
        layer.bindPopup('Neighborhood: ' + feature.properties.name); // Replace 'name' with the actual property name in your GeoJSON data that represents the neighborhood name
      }
    });

    // Add the choropleth layer to the map
    geojson.addTo(myMap);
  });

