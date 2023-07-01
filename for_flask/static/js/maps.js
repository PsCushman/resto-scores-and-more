// Create the map
var map = L.map('map').setView([37.770725811598936, -122.4444875079379], 12.5); // Set the initial center and zoom level

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

// Loop through the restaurants data and add markers to the map
restaurants.forEach(function(restaurant) {
    var lat = parseFloat(restaurant.business_latitude);
    var lon = parseFloat(restaurant.business_longitude);
  
    // Check if latitude and longitude are valid numbers
    if (!isNaN(lat) && !isNaN(lon)) {
      // Apply your logic for score color and label
      var scoreColor;
      var scoreLabel;
      var inspectionScore = restaurant.inspection_score;
  
      if (typeof inspectionScore === 'undefined' || isNaN(inspectionScore)) {
        scoreColor = 'gray';
        scoreLabel = 'Unrated';
      } else if (inspectionScore >= 90) {
        scoreColor = 'green';
        scoreLabel = inspectionScore;
      } else if (inspectionScore >= 75 && inspectionScore <= 89) {
        scoreColor = 'yellow';
        scoreLabel = inspectionScore;
      } else {
        scoreColor = 'red';
        scoreLabel = inspectionScore;
      }
  
      // Create a marker with a popup
      var marker = L.marker([lat, lon]).bindPopup(
        `<div style="text-align: center;">
           <strong style="font-size: 14px;">${restaurant.business_name}</strong><br>
           <span style="font-size: 26px; background-color: ${scoreColor}; color: black; padding: 2px 5px; border-radius: 4px;">${scoreLabel}</span>
           <br>
           <strong style="font-size: 13px">Incident:</strong>
           <div style="width: 200px; word-wrap: break-word;">
                   ${restaurant.violation_description}
                 </div>
       </div>`
      );
  
      // Add the marker to the map
      marker.addTo(map);
    }
  });



 
  
  
  
  
  
  
  

