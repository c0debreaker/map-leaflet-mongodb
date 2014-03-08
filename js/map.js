console.log "querystring : ", location.search.split('tileprovider=')[1].split('&')[0];

var markersDisplayed = false,

    littleton = L.marker([42.1061, -88.3796]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.'),
    golden2   = L.marker([42.1051, -88.3794]).bindPopup('This is Golden2.'),

    cities = L.layerGroup([littleton, denver, aurora, golden]),

    // minimal   = L.tileLayer(MapLib.getUrlTile(), {styleId: 22677, attribution: MapLib.getAboutMap()}),
    minimal   = L.tileLayer(MapLib.getUrlTile(), {styleId: 997, attribution: MapLib.getAboutMap()}),
    midnight  = L.tileLayer(MapLib.getUrlTile(), {styleId: 999,   attribution: MapLib.getAboutMap()}),
    motorways = L.tileLayer(MapLib.getUrlTile(), {styleId: 46561, attribution: MapLib.getAboutMap()});

var map = L.map('leafletmap', {
        center: [39.73, -104.99],
        zoom: 9,
        layers: [minimal, motorways, cities]
    });

var baseMaps = {
        "Minimal": minimal,
        "Night View": midnight
    };

var overlayMaps = {
        "Motorways": motorways,
        "Cities": cities
    };


//    circle = L.circle(
//    [51.508, -0.11], 500, {
//        color: 'red',
//        fillColor: '#f03',
//        fillOpacity: 0.5
//    }).addTo(map).bindPopup("<b>Hi Neil!</b><br />Ako ay isang bilog.");

    //	var map = L.map('map').setView([42.1061, -88.3796], 13, layers: [minimal, motorways, cities]);
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    console.log('----cities------>>>>>>>>>',cities);

    L.marker([51.5011, -0.11263],{icon: MapLib.getCustomMarker()}).addTo(map).bindPopup("Neil is waiting for you at <b>Launcelot Street</b>");//.openPopup();
    L.marker([51.50367, -0.07427],{icon: MapLib.getCustomMarker()}).addTo(map).bindPopup("<b>Hello Neil!</b><br />How's Butler's Wharf?");//.openPopup();
    L.marker([51.51464, -0.12162],{icon: MapLib.getCustomMarker()}).addTo(map).bindPopup("<b>Hi Ron!</b> What do you think about \"The Prince of Wales\"?");//.openPopup();
    L.marker([51.51308, -0.09398],{icon: MapLib.getCustomMarker()}).addTo(map).bindPopup("Neil is at Williamson's Tavern.");//.openPopup();

    var popup = L.popup();

    map.on('click', onMapClick);

    $(document).ready(function(){
        $("#showmarkers").click(function(){
            if (markersDisplayed == false) {
                markersDisplayed = true;
                MapLib.showAllMarkers();
                // cities.addLayer(golden2);
            }
        });

        // wire up button click
        $('#go').click(function () {
            // get the address the user entered
            var address = $('#address').val();
            if (address) {
                // use Google Maps API to geocode the address
                // set up the Geocoder object
                var geocoder = new google.maps.Geocoder();
                // return the coordinates
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            console.log('===================>>>>>>>>>>>>>',results[0]);
                            console.log('-------------map----->>>>>>>', map);
                            //	$("#map").empty();
                            mapIt(results[0].geometry.location.lat(), results[0].geometry.location.lng(), address);
                            // print results
                            // printLatLong(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                        } else {
                            showErrorMessage('Google did not return any results.');
                        }

                    } else {
                        showErrorMessage("Reverse Geocoding failed due to: " + status);
                    }
                });
            }
            else {
                showErrorMessage('Please enter an address');
            }
        });
    });

    function mapIt(lat, lon, address) {

        //L.map('map').setView([lat, lon], 18);
        map.panTo([lat,lon]);
        map.setZoom(18);
        console.log('--------mapIt----->>>>>>>>>>','LatLng('+lat.toString()+','+lon.toString()+')');

        //TODO: I don't think we need to declare marker. We can just call L.marker directly
        var marker = L.marker([lat,lon]).addTo(map).bindPopup('<strong>Address:</strong> '+address+'<br/><strong>Lat:</strong> '+lat.toFixed(3).toString()+'<br/><strong>Lon:</strong> '+lon.toFixed(3).toString()).openPopup();

    }

    // capture click event on map
    function onMapClick(e) {
        //popup.setLatLng(e.latlng).setContent("You poked me at " + e.latlng.toString()).openOn(map);
        console.log('=================>>>>>>>>>>>>>>>',e.latlng.toString());
        MapLib.addMarker(e.latlng.toString());
        var newMarker = L.marker(e.latlng).addTo(map).bindPopup("Marker on location Lat-Long : "+e.latlng.toString()+" has been saved to MongoDB.").openPopup();
        cities.addLayer(newMarker);
    }

    function printLatLong(lat, long) {
        // $('body').append('<p>Lat: ' + lat + '</p>');
        //  $('body').append('<p>Long: ' + long + '</p>');
    }

    function showErrorMessage(msg) {
        alert(msg);
    }
