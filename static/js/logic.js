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
let markers = L.markerClusterGroup();

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

      // Check for valid latitude and longitude
      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Create a marker and bind a popup
        let marker = L.marker([latitude, longitude])
          .bindPopup(restaurant.business_name + '<br>' + restaurant.inspection_score);
        // Add the marker to the cluster group
        markers.addLayer(marker);
      }
    });

    // Add the marker cluster group to the map
    myMap.addLayer(markers);
  });
