let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the API query variables.
let baseURL = "https://data.sfgov.org/resource/pyih-qa8i.json?";
let neighborhoodURL = "https://data.sfgov.org/resource/6ia5-2f8k.json"; 

// Fetch the neighborhood GeoJSON data
fetch(neighborhoodURL)
  .then(response => response.json())
  .then(neighborhoodData => {
    // Create a data structure to store average inspection scores by neighborhood
    let averageScoresByNeighborhood = {};

    // Fetch the restaurant data
    fetch(baseURL)
      .then(response => response.json())
      .then(restaurantData => {
        // Calculate average inspection scores by neighborhood
        restaurantData.forEach(restaurant => {
          let neighborhood = restaurant.neighborhood;
          let inspectionScore = restaurant.inspection_score;

          if (!averageScoresByNeighborhood[neighborhood]) {
            averageScoresByNeighborhood[neighborhood] = {
              totalScore: inspectionScore,
              count: 1
            };
          } else {
            averageScoresByNeighborhood[neighborhood].totalScore += inspectionScore;
            averageScoresByNeighborhood[neighborhood].count++;
          }
        });

        // Calculate the average score for each neighborhood
        for (let neighborhood in averageScoresByNeighborhood) {
          averageScoresByNeighborhood[neighborhood].averageScore = averageScoresByNeighborhood[neighborhood].totalScore / averageScoresByNeighborhood[neighborhood].count;
        }

        // Create the choropleth map layer
        let geojsonLayer = L.geoJSON(neighborhoodData, {
          style: function (feature) {
            let neighborhood = feature.properties.neighborhood;
            let averageScore = averageScoresByNeighborhood[neighborhood].averageScore;
            let fillColor;
          
            if (averageScore >= 90) {
              fillColor = 'green';
            } else if (averageScore >= 75 && averageScore <= 89) {
              fillColor = 'yellow';
            } else {
              fillColor = 'red';
            }
          
            return {
              fillColor: fillColor,
              color: 'black',
              weight: 1,
              fillOpacity: 0.6
            };
          },
          
          onEachFeature: function (feature, layer) {
            let neighborhood = feature.properties.neighborhood;
            let averageScore = averageScoresByNeighborhood[neighborhood].averageScore;

            layer.bindPopup(`<div style="text-align: center;">
                               <strong style="font-size: 14px;">${neighborhood}</strong><br>
                               <strong>AVERAGE INSPECTION SCORE:</strong><br> 
                               <span style="font-size: 26px; background-color: ${fillColor}; color: black; padding: 2px 5px; border-radius: 4px;">${averageScore}</span>
                             </div>`);
          }
        });

        // Add the choropleth layer to the map
        myMap.addLayer(geojsonLayer);
      });
  });
