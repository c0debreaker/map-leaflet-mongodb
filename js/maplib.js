var MapLib = (function() {

var
    aboutMap = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
               '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
               'Imagery © <a href="http://cloudmade.com">CloudMade</a>',

    // Open Street Maps
    console.log "querystring : ", location.search.split('tileprovider=')[1].split('&')[0]
    urlTile = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    //urlTile = 'http://{s}.tile.cloudmade.com/72ca1b1af51047529c39511853c8b13f/{styleId}/256/{z}/{x}/{y}.png',

    maxZoom = 18,
    defaultZoom = 9,
    markerLayers = [],

    customMarker = L.icon({
        iconUrl: 'images/neilpic.png',
        shadowUrl: 'images/neilshadow.png',
        iconSize:     [30, 30], // size of the icon
        shadowSize:   [30, 30], // size of the shadow
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
        shadowAnchor: [20, 20],  // the same for the shadow
        popupAnchor:  [-3, -3] // point from which the popup should open relative to the iconAnchor
    });

    return {
        getMaxZoom : function() {
            return maxZoom;
        },

        getDefaultZoom : function() {
            return maxZoom;
        },

        getUrlTile : function() {
            return urlTile;
        },

        getAboutMap: function() {
            return aboutMap;
        },

        getMarkerLayers: function() {
            return markerLayers;
        },

        getCustomMarker: function() {
            return customMarker;
        },

        addMarker: function(latlon) {

            $.ajax({
                type: "POST",
                url: "addmarker.php",
                data: {
                    operation: "ADD",
                    latlon: latlon
                }
            })
        },

        removeMarker: function(id) {
            // TODO: figure out markerLayers assignment
            map.removeLayer(markerLayers["str"+id.toString()]);

            $.ajax({
                type: "POST",
                url: "removemarker.php",
                data: {
                    operation: "REMOVE",
                    id: id
                }
            })
        },

        showAllMarkers: function() {
            $.ajax({
                type: "POST",
                url: "accessmarkers.php",
                data: {
                    operation: "GET"
                }
            }).done(function(json) {

                $.each(json, function(i, item) {
                    var marker = new L.marker([item.lat, item.lon]).addTo(map);

                    function removeThisMarker(e) {
                        // This function is a closure. It is closed-over `marker`, `i`, and `item`
                        // ie. it keeps them in it's scope wherever it is called from
                        map.removeLayer(marker);

                        $.ajax({
                            type: "POST",
                            url: "removemarker.php",
                            data: {
                                operation: "REMOVE",
                                id: i
                            }
                        })
                        e.preventDefault();
                        return true;
                    }

                    // Generate the DOM elements we want for the popup
                    var popupElements = $("<div>Marker at LatLong [" + item.lat.toString() + ", " + item.lon.toString() + "]" +'<br/><a href="#">Remove marker?</a></div>');

                    //Selected the popup's anchor tag and add a click event
                    $("a", popupElements).on("click", removeThisMarker);

                    // Add the DOM elements as the contents of this popup
                    marker.bindPopup(popupElements.get(0));//.openPopup();

                    // Finally, add the marker to the map
                    cities.addLayer(marker);
                });
            })
        }

    }

}());

