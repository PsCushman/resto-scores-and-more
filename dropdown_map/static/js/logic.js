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
          (scoreRange === "All") ||
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

        if (!isNaN(latitude) && !isNaN(longitude)) {
          let marker = L.marker([latitude, longitude])
            .bindPopup(`<div style="text-align: center;">
                         <strong style="font-size: 14px;">${restaurant.business_name}</strong><br>
                         <strong>ADDRESS:</strong><br> ${restaurant.business_address}<br>
                         <strong>INSPECTION SCORE:</strong><br> 
                         <span style="font-size: 26px; background-color: ${scoreColor}; color: black; padding: 2px 5px; border-radius: 4px;">${restaurant.inspection_score}</span><br>
                         <strong>VIOLATION DESCRIPTION:</strong><br>
                         ${restaurant.violation_description}
                       </div>`);
          markers.addLayer(marker);
        }
      });

      myMap.addLayer(markers);
    }

    // Define a function to handle filter updates
    function handleFilterUpdate() {
      const selectedYear = document.getElementById("year-filter").value;
      const selectedScoreRange = document.getElementById("score-filter").value;
      const selectedRiskCategory = document.getElementById("risk-category-filter").value;
      const filteredData = filterData(data, selectedYear, selectedScoreRange, selectedRiskCategory);
      updateMarkers(filteredData);
      updateChart(filteredData); // Call the function to update the chart
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

      var scoreRanges = [
        { color: 'green', min: 90, max: Infinity },
        { color: 'yellow', min: 80, max: 89 },
        { color: 'red', min: 70, max: 79 },
        { color: 'gray', min: 'Unrated', max: 'Unrated' }
      ];

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

    updateMarkers(data); // Initial marker update with all data
    updateChart(data); // Initial chart update with all data
  });

// Function to create and update the chart
function updateChart(data) {
  // Count the occurrences of each inspection type
  const inspectionTypesCount = data.reduce((count, restaurant) => {
    const inspectionType = restaurant.inspection_type;
    count[inspectionType] = (count[inspectionType] || 0) + 1;
    return count;
  }, {});

  // Convert the inspection types count object into an array of objects
  const inspectionTypesData = Object.entries(inspectionTypesCount).map(([type, count]) => ({ type, count }));

  // Get the width of the map container
  const mapContainerWidth = document.getElementById("map").clientWidth;

  // Set up the chart dimensions and margins
  const width = mapContainerWidth;
  const height = 600;
  const margin = { top: 60, right: 0, bottom: 250, left: 200 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Remove existing chart container content
  d3.select("#chart-container").html("");

  // Create the chart SVG container
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add the chart title
  svg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "35px")
    .style("font-weight", "bold")
    .style("fill", "white") // Updated font color
    .text("Inspection Types");

  // Create the x-scale
  const xScale = d3.scaleBand()
    .domain(inspectionTypesData.map(d => d.type))
    .range([0, chartWidth])
    .padding(0.2);

  // Create the y-scale
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(inspectionTypesData, d => d.count)])
    .range([chartHeight, 0]);

  // Create the x-axis
  const xAxis = d3.axisBottom(xScale)
    .tickSize(1)
    .tickPadding(10);

  // Create the y-axis
  const yAxis = d3.axisLeft(yScale)
    .tickSize(-chartWidth)
    .tickPadding(10);

  // Add the x-axis to the chart
  svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("color", "#d0caca");

  // Add the y-axis to the chart
  svg.append("g")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .style("color", "#d0caca");

  // Add the bars to the chart
  svg.selectAll("rect")
    .data(inspectionTypesData)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.type))
    .attr("y", d => yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("height", d => chartHeight - yScale(d.count))
    .attr("fill", "slategray")
    .style("opacity", 0)
    .transition()
    .duration(800)
    .attr("y", d => yScale(d.count))
    .attr("height", d => chartHeight - yScale(d.count))
    .style("opacity", 1)
    .style("color", "#d0caca");

  // Add labels to the bars
  svg.selectAll(".bar-label")
    .data(inspectionTypesData)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => xScale(d.type) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.count) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("fill", "white")
    .style("opacity", 0)
    .transition()
    .duration(800)
    .attr("y", d => yScale(d.count) - 15)
    .style("opacity", 1)
    .text(d => d.count);
}
