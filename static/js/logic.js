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

  // Create an object to hold the sum and count for each geojson name
  let propertyScores = {};

  // D3 to get the GeoJSON data
  d3.json("https://data.sfgov.org/resource/6ia5-2f8k.geojson").then(function(geojson) {
    // Iterate over the geojson features and initialize the sum and count for each name
    geojson.features.forEach(feature => {
      let name = feature.properties.name;
      propertyScores[name] = {
        sum: 0,
        count: 0
      };
    });

    // Iterate over the filtered data and accumulate the sum and count for each geojson name
    filteredData.forEach(item => {
      let coordinates = item.coordinates; // Extract the coordinates from the JSON data
      let inspectionScore = parseFloat(item.inspection_score); // Parse the inspection score as a float

      // Iterate over the geojson features and find the matching name
      geojson.features.forEach(feature => {
        let name = feature.properties.name;

        // Check if the coordinates match
        if (coordinates[0] === feature.geometry.coordinates[0] && coordinates[1] === feature.geometry.coordinates[1]) {
          propertyScores[name].sum += inspectionScore;
          propertyScores[name].count++;
        }
      });
    });

    // Calculate the average inspection score for each geojson name
    for (let name in propertyScores) {
      let average = propertyScores[name].sum / propertyScores[name].count;
      propertyScores[name] = average;
    }

    // Create the choropleth layer using L.choropleth
    let choroplethLayer = L.choropleth(geojson, {
      valueProperty: feature => {
        let name = feature.properties.name;
        return propertyScores[name] || 0;
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
        let name = feature.properties.name;
        let score = propertyScores[name] || 0;
        layer.bindPopup("District: " + name + "<br>Average Inspection Score: " + score.toFixed(2));
      }
    }).addTo(myMap);

    // Fit the map bounds to the choropleth layer
    myMap.fitBounds(choroplethLayer.getBounds());
  });
});
