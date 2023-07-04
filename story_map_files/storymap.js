    (function ($) {
    'use strict';


    $.fn.storymap = function(options) {

        var defaults = {
            selector: '[data-place]',
            breakpointPos: '33.333%',
            createMap: function () {
                // create a map in the "map" div, set the view to a given place and zoom
                var map = L.map('map').setView([37.773972, -122.431297], 12);

                // add an OpenStreetMap tile layer
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                return map;
            }
        };

        var settings = $.extend(defaults, options);


        if (typeof(L) === 'undefined') {
            throw new Error('Storymap requires Laeaflet');
        }
        if (typeof(_) === 'undefined') {
            throw new Error('Storymap requires underscore.js');
        }

        function getDistanceToTop(elem, top) {
            var docViewTop = $(window).scrollTop();

            var elemTop = $(elem).offset().top;

            var dist = elemTop - docViewTop;

            var d1 = top - dist;

            if (d1 < 0) {
                return $(window).height();
            }
            return d1;

        }

        function highlightTopPara(paragraphs, top) {

            var distances = _.map(paragraphs, function (element) {
                var dist = getDistanceToTop(element, top);
                return {el: $(element), distance: dist};
            });

            var closest = _.min(distances, function (dist) {
                return dist.distance;
            });

            _.each(paragraphs, function (element) {
                var paragraph = $(element);
                if (paragraph[0] !== closest.el[0]) {
                    paragraph.trigger('notviewing');
                }
            });

            if (!closest.el.hasClass('viewing')) {
                closest.el.trigger('viewing');
            }
        }

        function watchHighlight(element, searchfor, top) {
            var paragraphs = element.find(searchfor);
            highlightTopPara(paragraphs, top);
            $(window).scroll(function () {
                highlightTopPara(paragraphs, top);
            });
        }

        var makeStoryMap = function (element, markers) {

            var topElem = $('<div class="breakpoint-current"></div>')
                .css('top', settings.breakpointPos);
            $('body').append(topElem);

            var top = topElem.offset().top - $(window).scrollTop();

            var searchfor = settings.selector;

            var paragraphs = element.find(searchfor);

            paragraphs.on('viewing', function () {
                $(this).addClass('viewing');
            });

            paragraphs.on('notviewing', function () {
                $(this).removeClass('viewing');
            });

            watchHighlight(element, searchfor, top);

            var map = settings.createMap();

            var initPoint = map.getCenter();
            var initZoom = map.getZoom();

            var fg = L.featureGroup().addTo(map);

            function showMapView(key) {

                fg.clearLayers();
                if (key === 'overview') {
                    map.setView(initPoint, initZoom, true);
                } else if (markers[key]) {
                    var marker = markers[key];
                    fg.addLayer(L.marker([marker.lat, marker.lon]));

                    map.setView([marker.lat, marker.lon], marker.zoom, 1);
                }

            }

            paragraphs.on('viewing', function () {
                showMapView($(this).data('place'));
            });
        };

        makeStoryMap(this, settings.markers);

        return this;
    }

}(jQuery));


// Add a tile layer to the map
// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// var blueMarkers = {
//     good_hood: {lat: 37.7636, lon: -122.4200},
//     bad_hood: {lat: 37.7467, lon: -122.4863},
//     sunflower: {lat: 37.762647, lon: -122.397545},
//     lees: {lat: 37.729455, lon: -122.386364},
//     schools: {lat: 58.17993, lon: 8.12952},
//     peter: {lat: 37.801278, lon: -122.410384},
//     alice: {lat: 37.759386, lon: -122.469292}
// };

// // Create markers at the specified coordinates
// for (var markerKey in blueMarkers) {
//     if (blueMarkers.hasOwnProperty(markerKey)) {
//         var markerData = blueMarkers[markerKey];
//         L.marker([markerData.lat, markerData.lon]).addTo(map);
//     }
// }




