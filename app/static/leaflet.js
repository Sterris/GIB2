function setMap(){
    console.log("Loading map");

    var map = L.map('map').setView([63.4, 10.4], 13);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibW9uc2VtIiwiYSI6ImNqczVzdGdmbTAwY24zeW9hMjJtYjk0YnIifQ.ddvzRzPgfKeLtF9RrFuZOg'
    }).addTo(map);

    //Calling the function here, but missing eventlist per now.
    // addMarkers(map, eventlist)
    return map
}

var map = setMap();
window.onload=map;
var marker = L.marker();
var clickcount=0;

var Icon = L.Icon.extend({
    options: {
        iconUrl: 'https://cdn2.iconfinder.com/data/icons/location-map-simplicity/512/theatre-512.png',
        iconSize:     [30, 50],
        iconAnchor:   [15, 49],
        popupAnchor:  [-3, -76]
    }
});
//bruk disse markerene så får me alle i samme størrelse og format.
//https://www.iconfinder.com/iconsets/map-locations-filled-pixel-perfect
var theaterpin = new Icon({iconUrl: 'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-16-256.png'});
var starpin = new Icon({iconUrl: 'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-28-512.png'});
var musicpin = new Icon({iconUrl : 'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-01-512.png'});
var partypin = new Icon({iconUrl : 'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-08-512.png'});
var coursepin=new Icon({iconUrl : 'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-24-512.png'});
var bookpin = new Icon({iconUrl : 'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-09-512.png'});
var outdoorpin=new Icon({iconUrl : 'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-27-256.png'});
var exhitionpin=new Icon({iconUrl:'https://cdn2.iconfinder.com/data/icons/map-locations-filled-pixel-perfect/64/pin-map-location-13-512.png'});



//Lager maker i brukers posisjon
pos= document.getElementById("pos");
pos.addEventListener("click",getPosition);
function getPosition(){
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
                //You have your location here
                console.log("Latitude: " + pos.coords.latitude +
                    " Longitude: " + pos.coords.longitude);
                    if (clickcount==0){
                        marker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
                        marker.setIcon(starpin);
                        map.setView([pos.coords.latitude, pos.coords.longitude], 13, {animation: true});
                        marker.bindPopup("<strong> Din posisjon!</strong>").addTo(map);
                        //circle = makeRadius([pos.coords.latitude, pos.coords.longitude],500);
                        //circle.addTo(map);
                        clickcount++;
                        console.log(clickcount);
                        }
                    else {
                        map.removeLayer(marker);
                        //map.removeLayer(circle);
                        clickcount=0;
                    }
            });
    }else {
        console.log("Geolocation is not supported by this browser.");
    }
}


//Gjør at man kan trykke på kartet for å få posisjon.
markpos= document.getElementById("markpos");
markpos.addEventListener("click",markPosition);
function markPosition() {
    map.on('click', function (e) {
        if (clickcount == 0) {
            marker.setLatLng(e.latlng).addTo(map);
            marker.setIcon(starpin);
            marker.bindPopup("<strong>" + e.latlng + "</strong>").addTo(map);
            //circle = makeRadius(e.latlng, 500);
            //circle.addTo(map);

            marker.on('dragend', markerDrag=false);
            clickcount++;
        }
        else{
            map.removeLayer(marker);
            //map.removeLayer(circle);
            clickcount = 0;
        }
    });
}

function makeRadius(pos,radius){
    var circle = L.circle(pos, {
    color: 'blue',
    fillColor: 'blue',
    fillOpacity: 0.3,
    radius: radius});
    return circle;
}



// var myEvent = {Title:"Tittel", venueCoordinates:[63.4224338, 10.3957807]}
//     var currentEvent = L.marker(myEvent.venueCoordinates).addTo(map);



//Function that adds markers to map.
//Also needs a array with events
function addMarkers(map, eventlist) {
    for (event in eventlist)
        var category = event.category_name;
        switch(category){
            case 'Music': icon = musicpin;
            case 'Theater': icon = theaterpin;
            case 'Party': icon = partypin;
            case 'Course': icon = coursepin;
            case 'Literature' : icon = bookpin;
            case 'Outdoor' : icon = outdoorpin;
            case 'Exhibition':icon = exhitionpin;
        }
        var currentMarker = L.marker(event.venueCoordinates).addTo(map);
        currentMarker.setIcon(icon);
        currentMarker.bindPopup(event.Title +""); //Ikke sikker på om nødvendig med +""
        currentMarker.on('mouseover', function (ev) {
             ev.target.openPopup();
             currentMarker.on('mouseout', function (e) {
                 e.target.closePopup();

             });

         });
}

