// Create the Leaflet map
let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 18
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// D3 to get the JSON data
d3.json("https://data.sfgov.org/resource/pyih-qa8i.json").then(function(data) {
  // Filter out businesses without coordinates or inspection scores
  let filteredData = data.filter(item => item.coordinates && item.inspection_score);

  // Create an object to hold the inspection scores for each coordinate
  let inspectionScores = {};

  // Iterate over the filtered data and store inspection scores by coordinates
  filteredData.forEach(item => {
    let coordinates = [
      parseFloat(item.coordinates[0]).toFixed(6),
      parseFloat(item.coordinates[1]).toFixed(6)
    ];
    let inspectionScore = parseFloat(item.inspection_score);

    // Check if the coordinates exist in the inspectionScores object
    if (coordinates in inspectionScores) {
      inspectionScores[coordinates].push(inspectionScore);
    } else {
      inspectionScores[coordinates] = [inspectionScore];
    }
  });

  // D3 to get the GeoJSON data
  d3.json("https://data.sfgov.org/resource/6ia5-2f8k.geojson").then(function(geojson) {
    // Iterate over the geojson features and calculate the average inspection score for each district
    geojson.features.forEach(feature => {
      let coordinates = feature.geometry.coordinates.map(coord =>
        parseFloat(coord).toFixed(6)
      );
      let district = feature.properties.name;

      // Check if the coordinates exist in the inspectionScores object
      if (coordinates in inspectionScores) {
        let scores = inspectionScores[coordinates];
        
        if (scores && scores.length > 0) { // Check if scores is defined and has a length greater than 0
          let sum = scores.reduce((acc, cur) => acc + cur, 0);
          let average = sum / scores.length;
          inspectionScores[coordinates] = average;
        } else {
          inspectionScores[coordinates] = undefined; // No inspection scores for the district
        }
      } else {
        inspectionScores[coordinates] = undefined; // No inspection scores for the district
      }
    });

    // Create the choropleth layer using L.choropleth
    let choroplethLayer = L.choropleth(geojson, {
      valueProperty: feature => {
        let coordinates = feature.geometry.coordinates.map(coord =>
          parseFloat(coord).toFixed(6)
        );
        return inspectionScores[coordinates] || 0;
      },
      scale: ["#FF0000", "#FFA500", "#FFFF00", "#008000"],
      steps: 4,
      mode: "q",
      style: {
        color: "#fff",
        weight: 1,
        fillOpacity: 0.4
      },
      onEachFeature: (feature, layer) => {
        let district = feature.properties.name;
        let coordinates = feature.geometry.coordinates.map(coord =>
          parseFloat(coord).toFixed(6)
        );
        let score = inspectionScores[coordinates];
        let popupContent = "District: " + district + "<br>";
        
        if (score !== undefined) {
          popupContent += "Average Inspection Score: " + score.toFixed(2);
        } else {
          popupContent += "No data";
        }
        
        layer.bindPopup(popupContent);
      }
    }).addTo(myMap);

    // Fit the map bounds to the choropleth layer
    myMap.fitBounds(choroplethLayer.getBounds());
  });
});
