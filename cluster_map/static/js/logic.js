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

// Create an array to store the markers
let markers = [];

// Create a marker cluster group
let markerCluster = L.markerClusterGroup();

// Get the data with fetch.
fetch(baseURL)
  .then(response => response.json())
  .then(data => {
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

        // Add the marker to the array and the cluster group
        markers.push(marker);
        markerCluster.addLayer(marker);
      }
    });

    // Add the marker cluster group to the map
    myMap.addLayer(markerCluster);

    // Create the search control
    var controlSearch = new L.Control.Search({
      position: 'topright',
      layer: markerCluster,
      initial: false,
      zoom: 12,
      marker: false
    });

    // Add the search control to the map
    myMap.addControl(controlSearch);

    // Create the score filter control
    var controlScores = L.control({ position: 'topright' });

    controlScores.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<h4>Filter by Score</h4>';

      // Define the score ranges
      var scoreRanges = [
        { color: 'green', min: 90, max: Infinity },
        { color: 'yellow', min: 75, max: 89 },
        { color: 'red', min: 0, max: 74 }
      ];

      // Create checkboxes for each score range
      scoreRanges.forEach(range => {
        div.innerHTML +=
          '<label><input type="checkbox" class="score-checkbox" value="' +
          range.color +
          '" checked>' +
          range.min +
          ' - ' +
          (range.max === Infinity ? '∞' : range.max) +
          '</label><br>';
      });

      // Add event listener to handle checkbox changes
      div.addEventListener('change', function (event) {
        var checkboxes = document.getElementsByClassName('score-checkbox');

        // Create an array to store the checked score colors
        var checkedColors = [];

        // Loop through checkboxes and update marker visibility
        Array.from(checkboxes).forEach(checkbox => {
          var scoreColor = checkbox.value;
          var isChecked = checkbox.checked;

          if (isChecked) {
            checkedColors.push(scoreColor); // Store the checked score colors
          }
        });

        // Remove all markers from the cluster group
        markerCluster.clearLayers();

        // Loop through the markers and add back the ones with matching score colors
        markers.forEach(marker => {
          var markerScoreColor = marker._popup._content
            .split('background-color: ')[1]
            .split(';')[0];

          if (checkedColors.includes(markerScoreColor)) {
            markerCluster.addLayer(marker); // Add the marker back to the cluster group
          }
        });
      });

      return div;
    };

    // Add the score filter control to the map
    controlScores.addTo(myMap);
  });
