// Create the map
let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

// Create the grayscale tile layer
let grayscaleTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  className: 'grayscale-tile-layer'
}).addTo(myMap);

// Store the API query variables and create the marker cluster group
let baseURL = "https://data.sfgov.org/resource/pyih-qa8i.json?";
let markers = L.markerClusterGroup();

// Get the data with fetch.
fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    // Function to filter data by year, inspection score range, and risk category
    function filterData(data, year, scoreRange, riskCategory) {
      return data.filter(restaurant => {
        const inspectionDate = new Date(restaurant.inspection_date);
        const inspectionYear = inspectionDate.getFullYear().toString();
        const inspectionScore = parseInt(restaurant.inspection_score);

        // Check if the restaurant matches the selected year, inspection score range, and risk category
        const yearMatch = year === "All" || inspectionYear === year;
        const scoreMatch =
          (scoreRange === "All") || // Include the condition for "All" inspection scores
          (scoreRange === "90+" && inspectionScore >= 90 && inspectionScore <= 100) ||
          (scoreRange === "89-80" && inspectionScore >= 80 && inspectionScore <= 89) ||
          (scoreRange === "79-70" && inspectionScore >= 70 && inspectionScore <= 79) ||
          (scoreRange === "<69" && inspectionScore < 69);
        const riskCategoryMatch = riskCategory === "All" || restaurant.risk_category === riskCategory;

        return yearMatch && scoreMatch && riskCategoryMatch;
      });
    }

    // Function to update the markers on the map
    function updateMarkers(data) {
      markers.clearLayers(); // Clear existing markers

      data.forEach(restaurant => {
        // Get the latitude and longitude
        let latitude = parseFloat(restaurant.business_latitude);
        let longitude = parseFloat(restaurant.business_longitude);
        let inspectionScore = restaurant.inspection_score;
        let violationDescription = restaurant.violation_description;

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
                         <span style="font-size: 26px; background-color: ${scoreColor}; color: black; padding: 2px 5px; border-radius: 4px;">${restaurant.inspection_score}</span><br>
                         <strong>VIOLATION DESCRIPTION:</strong><br>
                         ${restaurant.violation_description}
                       </div>`);
          // Add the marker to the cluster group
          markers.addLayer(marker);
        }
      });

      // Add the marker cluster group to the map
      myMap.addLayer(markers);
    }

    // Define a function to handle filter updates
    function handleFilterUpdate() {
      const selectedYear = document.getElementById("year-filter").value;
      const selectedScoreRange = document.getElementById("score-filter").value;
      const selectedRiskCategory = document.getElementById("risk-category-filter").value;
      const filteredData = filterData(data, selectedYear, selectedScoreRange, selectedRiskCategory);
      updateMarkers(filteredData);
    }

    // Populate the year filter dropdown
    const yearFilterDropdown = document.getElementById("year-filter");
    yearFilterDropdown.addEventListener("change", handleFilterUpdate);

    // Populate the inspection score filter dropdown
    const scoreFilterDropdown = document.getElementById("score-filter");
    scoreFilterDropdown.addEventListener("change", handleFilterUpdate);

    // Populate the risk category filter dropdown
    const riskCategoryFilterDropdown = document.getElementById("risk-category-filter");
    riskCategoryFilterDropdown.addEventListener("change", handleFilterUpdate);

    // Create the legend control
    var controlScores = L.control({ position: 'topright' });

    controlScores.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<h4>Filter by Score</h4>';

      // Define the score ranges
      var scoreRanges = [
        { color: 'green', min: 90, max: Infinity },
        { color: 'yellow', min: 80, max: 89 },
        { color: 'red', min: 70, max: 79 },
        { color: 'gray', min: 'Unrated', max: 'Unrated' }
      ];

      // Iterate through the score ranges and create checkboxes with labels
      scoreRanges.forEach(range => {
        var label;
        if (range.min === 'Unrated' && range.max === 'Unrated') {
          label = range.min;
        } else if (range.max === Infinity) {
          label = range.min + '+';
        } else {
          label = range.min + ' - ' + range.max;
        }

        div.innerHTML +=
          '<label><input type="checkbox" class="score-checkbox" value="' +
          range.color +
          '" checked>' +
          label +
          '</label><br>';
      });

      return div;
    };


    // Initial marker update with all data
    updateMarkers(data);
  });
