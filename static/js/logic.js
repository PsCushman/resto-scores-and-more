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

// Define style object.
let mapStyle ={
  color: "blue",
  fillOpacity: 0.5,
  weight: 1.5
}

// Fetch the JSON data.
fetch("https://data.sfgov.org/resource/pyih-qa8i.json")
  .then(response => response.json())
  .then(jsonData => {
    // Group inspection scores by coordinate and calculate average
    let averageScoresByCoordinate = {};
    jsonData.forEach(item => {
      let coordinate = item.business_location && item.business_location.coordinates;
      if (coordinate && item.inspection_score) {
        if (!averageScoresByCoordinate[coordinate]) {
          averageScoresByCoordinate[coordinate] = {
            totalScore: 0,
            count: 0
          };
        }
        averageScoresByCoordinate[coordinate].totalScore += Number(item.inspection_score);
        averageScoresByCoordinate[coordinate].count++;
      }
    });

    // Calculate average scores
    for (let coordinate in averageScoresByCoordinate) {
      let averageScore = averageScoresByCoordinate[coordinate].totalScore / averageScoresByCoordinate[coordinate].count;
      averageScoresByCoordinate[coordinate] = averageScore;
    }

    // Getting the GeoJSON data
    d3.json(geoData).then(function(data){
      // Creating GeoJSON layer.
      L.geoJson(data, {
        style: function (feature) {
          let coordinate = feature.geometry.coordinates;
          let averageScore = averageScoresByCoordinate[coordinate];
          return {
            fillColor: getFillColor(averageScore),
            color: "blue",
            fillOpacity: 0.5,
            weight: 1.5
          };
        },
        onEachFeature: function (feature, layer){
          let coordinate = feature.geometry.coordinates;
          let averageScore = averageScoresByCoordinate[coordinate];

          // Create the popup content
          let popupContent = "<strong>" + feature.properties.business_name + "</strong><br>" +
            "Address: " + feature.properties.business_address + "<br>" +
            "City: " + feature.properties.business_city + "<br>" +
            "State: " + feature.properties.business_state + "<br>" +
            "Postal Code: " + feature.properties.business_postal_code + "<br>" +
            "Average Inspection Score: " + averageScore;

          // Bind the popup to the layer
          layer.bindPopup(popupContent);
        }
      }).addTo(myMap);
    });
  })
  .catch(error => console.log(error));

// Define a function to determine fill color based on inspection score
function getFillColor(score) {
  if (score >= 90) {
    return "#008000"; // Green
  } else if (score >= 80) {
    return "#FFFF00"; // Yellow
  } else {
    return "#FF0000"; // Red
  }
}
