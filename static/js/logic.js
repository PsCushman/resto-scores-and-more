// Creating the Leaflet map
let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Fetching the GeoJSON data
fetch("https://data.sfgov.org/resource/6ia5-2f8k.geojson")
  .then(response => response.json())
  .then(geojsonData => {
    // Fetching the JSON data
    fetch("https://data.sfgov.org/resource/pyih-qa8i.json")
      .then(response => response.json())
      .then(jsonData => {
        // Filter and process the data
        const filteredData = jsonData.filter(business => business.coordinates && business.inspection_score);
        const averages = {};

        filteredData.forEach(business => {
          geojsonData.features.forEach(feature => {
            const { coordinates } = business;
            if (isInsidePolygon(coordinates, feature.geometry.coordinates)) {
              if (!averages[feature.properties.name]) {
                averages[feature.properties.name] = {
                  count: 1,
                  totalScore: business.inspection_score
                };
              } else {
                averages[feature.properties.name].count++;
                averages[feature.properties.name].totalScore += business.inspection_score;
              }
            }
          });
        });

        for (const feature of geojsonData.features) {
          const name = feature.properties.name;
          const averageScore = averages[name] ? averages[name].totalScore / averages[name].count : 0;

          // Styling the choropleth map
          L.geoJSON(feature, {
            style: {
              fillColor: getColor(averageScore),
              fillOpacity: 0.6,
              color: 'black',
              weight: 1
            }
          }).addTo(myMap).bindPopup(`<b>${name}</b><br>Average Score: ${averageScore.toFixed(2)}`);
        }
      })
      .catch(error => console.error("Error fetching JSON data:", error));
  })
  .catch(error => console.error("Error fetching GeoJSON data:", error));

// Helper function to check if a point is inside a polygon
function isInsidePolygon(point, polygon) {
  const x = point[0];
  const y = point[1];
  let inside = false;

  for (let i = 0, j = polygon[0].length - 1; i < polygon[0].length; j = i++) {
    const xi = polygon[0][i][0];
    const yi = polygon[0][i][1];
    const xj = polygon[0][j][0];
    const yj = polygon[0][j][1];

    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

// Helper function to determine the color based on the score
function getColor(score) {
  return score >= 90 ? "#008000" :
         score >= 80 ? "#FFFF00" :
         score >= 70 ? "#FFA500" :
                       "#FF0000";
}
