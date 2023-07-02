let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Link to GeoJSON data
let geoData = "https://data.sfgov.org/resource/6ia5-2f8k.geojson";
// Link to JSON data
let jsonData = "https://data.sfgov.org/resource/pyih-qa8i.json";

// Fetching the JSON data
fetch(jsonData)
  .then(response => response.json())
  .then(jsonData => {
    // Getting the GeoJSON data
    d3.json(geoData).then(function(data) {
      // Creating GeoJSON layer with choropleth
      L.geoJson(data, {
        style: function(feature) {
          // Retrieve the relevant property for the choropleth
          let score = feature.properties.inspection_score;

          // Define the color based on the score value
          let fillColor = "#808080"; // Default color for missing values
          if (score >= 90) {
            fillColor = "#008000"; // Green
          } else if (score >= 80) {
            fillColor = "#FFFF00"; // Yellow
          } else if (score >= 0) {
            fillColor = "#FF0000"; // Red
          }

          // Return the style object
          return {
            color: "blue",
            fillColor: fillColor,
            fillOpacity: 0.5,
            weight: 1.5
          };
        },
        onEachFeature: function(feature, layer) {
          // Find the corresponding business in the JSON data
          let filteredData = jsonData.filter(
            item => item.business_id === feature.properties.business_id
          );

          // Create the popup content
          let popupContent = "<strong>" + feature.properties.name + "</strong><br>";

          if (filteredData.length > 0) {
            let jsonDataItem = filteredData[0];

            // Add additional data from the JSON
            popupContent +=
              "Address: " + (jsonDataItem.business_address || feature.properties.address) + "<br>";

            if (jsonDataItem.business_location && jsonDataItem.business_location.coordinates) {
              let coordinates = jsonDataItem.business_location.coordinates;
              popupContent += "Latitude: " + coordinates[1] + "<br>";
              popupContent += "Longitude: " + coordinates[0] + "<br>";
            }
          }

          // Bind the popup to the layer
          layer.bindPopup(popupContent);
        }
      }).addTo(myMap);
    });
  })
  .catch(error => console.log(error));
