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
        // Create a marker with a popup
        var marker = L.marker([lat, lon]).bindPopup(
            "<b>" + restaurant.business_name + "</b><br>" +
            "Inspection Score: " + restaurant.inspection_score + "<br>" +
            "Violation Description: " + restaurant.violation_description
        );

        // Add the marker to the map
        marker.addTo(map);
    }
});







