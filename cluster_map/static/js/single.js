// Store the API query variables.
let baseURL = "https://data.sfgov.org/resource/pyih-qa8i.json?";

// Get the data with fetch.
fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    var map = new L.Map('map', { zoom: 9 }); // Initialize map without setting center initially

    map.addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')); // Base layer

    var markersLayer = new L.LayerGroup(); // Layer containing searched elements
    map.addLayer(markersLayer);

    var controlSearch = new L.Control.Search({
      position: 'topright',
      layer: markersLayer,
      initial: false,
      zoom: 20,
      marker: false
    });

    map.addControl(controlSearch);

    // Populate map with markers from data
    data.forEach(restaurant => {
      var title = restaurant.business_name; // Value searched
      var latitude = parseFloat(restaurant.business_latitude); // Latitude
      var longitude = parseFloat(restaurant.business_longitude); // Longitude

      if (!isNaN(latitude) && !isNaN(longitude)) {
        var marker = new L.Marker(new L.latLng(latitude, longitude), { title: title });
        markersLayer.addLayer(marker);
        marker.setOpacity(0); // Set marker opacity to 0 to make it invisible
      }
    });

    // Set center to the first marker's location
    var firstMarker = markersLayer.getLayers()[0];
    if (firstMarker) {
      map.setView(firstMarker.getLatLng(), 9);
    }
  });

  fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    var map = new L.Map('map', { zoom: 9 }); // Initialize map without setting center initially

    map.addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')); // Base layer

    var markersLayer = new L.LayerGroup(); // Layer containing searched elements
    map.addLayer(markersLayer);

    var controlSearch = new L.Control.Search({
      position: 'topright',
      layer: markersLayer,
      initial: false,
      zoom: 20,
      marker: false
    });

    map.addControl(controlSearch);

    // Populate map with markers from data
    data.forEach(restaurant => {
      var title = restaurant.business_name; // Value searched
      var latitude = parseFloat(restaurant.business_latitude); // Latitude
      var longitude = parseFloat(restaurant.business_longitude); // Longitude

      if (!isNaN(latitude) && !isNaN(longitude)) {
        var marker = new L.Marker(new L.latLng(latitude, longitude), { title: title });
        markersLayer.addLayer(marker);
        marker.setOpacity(0); // Set marker opacity to 0 to make it invisible
      }
    });

    // Set center to the first marker's location
    var firstMarker = markersLayer.getLayers()[0];
    if (firstMarker) {
      map.setView(firstMarker.getLatLng(), 9);
    }
  });