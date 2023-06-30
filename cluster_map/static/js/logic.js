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
// let url = baseURL + "$$app_token=" + apiToken;

// Get the data with fetch.
fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    // Create a new marker cluster group.
    let markers = L.markerClusterGroup();

    // Loop through the data
    data.forEach(restaurant => {
      // Get the latitude and longitude
      let latitude = parseFloat(restaurant.business_latitude);
      let longitude = parseFloat(restaurant.business_longitude);
      let inspectionScore = restaurant.inspection_score;

      let scoreColor;
      if (inspectionScore >= 90) {
        scoreColor = 'green';
      } else if (inspectionScore >= 75 && inspectionScore <= 89) {
        scoreColor = 'yellow';
      } else {
        scoreColor = 'red';
      }

      // Check for valid latitude and longitude
      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Create a marker and bind a popup
        let marker = L.marker([latitude, longitude])
          .bindPopup(`<div style="text-align: center;">
                       <strong style="font-size: 14px;">${restaurant.business_name}</strong><br>
                       <strong>ADDRESS:</strong><br> ${restaurant.business_address}<br>
                       <strong>INSPECTION SCORE:</strong><br> 
                       <span style="font-size: 26px; background-color: ${scoreColor}; color: black; padding: 2px 5px; border-radius: 4px;">${restaurant.inspection_score}</span>
                     </div>`);
        // Add the marker to the cluster group
        markers.addLayer(marker);
      }
    });

    // Add the marker cluster group to the map
    myMap.addLayer(markers);

    // Create the search control
    var controlSearch = new L.Control.Search({
      position: 'topright',
      layer: markers,
      initial: false,
      zoom: 12,
      marker: false
    });

    // Add the search control to the map
    myMap.addControl(controlSearch);
  });