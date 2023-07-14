// Create the Leaflet map
let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// D3 to get the JSON data
d3.json("https://data.sfgov.org/resource/6ia5-2f8k.json").then(function(neighborhoodData) {
  // Convert JSON data to GeoJSON format
  let geojson = {
    type: "FeatureCollection",
    features: neighborhoodData.map(item => {
      return {
        type: "Feature",
        properties: {
          name: item.name,
          coordinates: item.the_geom.coordinates
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: item.the_geom.coordinates
        }
      };
    })
  };

  // D3 to get the JSON data
  d3.json("https://data.sfgov.org/resource/pyih-qa8i.json").then(function(inspectionData) {
    // Create an object to hold the inspection scores for each neighborhood
    let inspectionScores = {};

    // Group inspection scores by neighborhood
    inspectionData.forEach(item => {
      if (item.business_location && item.inspection_score !== undefined) {
        let businessCoordinates = item.business_location.coordinates;
        let inspectionScore = parseFloat(item.inspection_score);

        // Check if the business coordinates fall within any neighborhood's coordinates
        let neighborhood = geojson.features.find(feature =>
          turf.booleanPointInPolygon(turf.point(businessCoordinates), feature.geometry)
        );

        if (neighborhood) {
          let neighborhoodCoordinates = JSON.stringify(neighborhood.geometry.coordinates);

          if (neighborhoodCoordinates in inspectionScores) {
            inspectionScores[neighborhoodCoordinates].push(inspectionScore);
          } else {
            inspectionScores[neighborhoodCoordinates] = [inspectionScore];
          }
        }
      }
    });

    // Iterate over the geojson features and calculate the average inspection score for each neighborhood
    geojson.features.forEach(feature => {
      let coordinates = JSON.stringify(feature.geometry.coordinates);

      // Check if the coordinates exist in the inspectionScores object
      if (coordinates in inspectionScores) {
        let scores = inspectionScores[coordinates];
        let average = Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
        feature.properties.average_inspection_score = average;
      } else {
        feature.properties.average_inspection_score = undefined;
      }
    });

    // Create the choropleth layer using L.choropleth
    let choroplethLayer = L.choropleth(geojson, {
      valueProperty: "average_inspection_score",
      scale: ["#808080", "red", "yellow", "green"], // Gray, Red, Yellow, Green for the color scale
      steps: 4,
      mode: "q",
      style: {
        color: "gray",
        weight: 0.5,
        fillOpacity: 0.7
      },
      onEachFeature: (feature, layer) => {
        let neighborhood = feature.properties.name;
        let score = feature.properties.average_inspection_score;
        let popupContent = "Neighborhood: " + neighborhood + "<br>";

        if (score !== undefined) {
          popupContent += "Average Inspection Score: " + (score ? score.toFixed(0) : "No data");
        } else {
          popupContent += "No data";
        }

        layer.bindPopup(popupContent);

        layer.on("click", () => {
          console.log("Feature:", feature); // Log the feature data when clicked on the map
          console.log("Average Inspection Score:", score); // Log the average inspection score
        });
      },
      // Assigning color range based on avg. inspection score
      getColor: (value) => {
        if (value === undefined) {
          return "#808080"; // Assign gray color to "No Data"
        } else if (value >= 90) {
          return "green"; // Assign green color to range 90 and above
        } else if (value >= 85) {
          return "yellow"; // Assign yellow color to range 85-89
        } else if (value >= 81) {
          return "red"; // Assign red color to range 81-84
        } else {
          return "#808080"; // Assign gray color to any other value outside the specified ranges
        }
      }
    }).addTo(myMap);

    // Set up the legend.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      var limits = ["No Data", "81-84", "85-89", "90-100"];
      var colors = ["#808080", "red", "yellow", "green"];

      let labels = [];

      // Add the legend title.
      div.innerHTML += '<h4 style="text-align: center;">SF Public Health Inspection Scores<br><span style="font-size: 14px; font-weight: bold;">by neighborhood</span></h4>';

      // Create the legend color bar.
      for (var i = 0; i < limits.length; i++) {
        var colorRange = limits[i];
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          colorRange + '<br>';
      }

      return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);

    // Fit the map bounds to the choropleth layer
    myMap.fitBounds(choroplethLayer.getBounds());
  }).catch(function(error) {
    console.error("Error fetching inspection data:", error);
  });
}).catch(function(error) {
  console.error("Error fetching neighborhood data:", error);
});
