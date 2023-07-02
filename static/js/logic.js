// Create the Leaflet map
let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Perform AJAX request to get the JSON data
$.getJSON("https://data.sfgov.org/resource/pyih-qa8i.json", function(data) {
  // Process the JSON data and filter out businesses without coordinates or inspection scores
  let filteredData = data.filter(item => item.coordinates && item.inspection_score);

  // Calculate the average inspection score for each geojson property
  let propertyScores = {};
  filteredData.forEach(item => {
    let property = JSON.stringify(item.coordinates);
    if (property in propertyScores) {
      propertyScores[property].push(parseInt(item.inspection_score));
    } else {
      propertyScores[property] = [parseInt(item.inspection_score)];
    }
  });

  // Calculate the average score for each property
  for (let property in propertyScores) {
    let scores = propertyScores[property];
    let sum = scores.reduce((acc, cur) => acc + cur, 0);
    let average = sum / scores.length;
    propertyScores[property] = average;
  }

  // Perform AJAX request to get the GeoJSON data
  $.getJSON("https://data.sfgov.org/resource/6ia5-2f8k.geojson", function(geojson) {
    // Create the choropleth layer using L.choropleth
    let choroplethLayer = L.choropleth(geojson, {
      valueProperty: function(feature) {
        let property = feature.properties.name;
        return propertyScores[property] || 0;
      },
      scale: ["#FF0000", "#FFA500", "#FFFF00", "#008000"],
      steps: 4,
      mode: "q",
      style: {
        color: "#fff",
        weight: 1,
        fillOpacity: 0.5
      },
      onEachFeature: function(feature, layer) {
        let property = feature.properties.name;
        let score = propertyScores[property] || 0;
        layer.bindPopup("District: " + property + "<br>Average Inspection Score: " + score.toFixed(2));
      }
    }).addTo(myMap);

    // Add the choropleth layer to the map
    myMap.fitBounds(choroplethLayer.getBounds());
  });
});
