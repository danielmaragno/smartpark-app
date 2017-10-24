"use strict";

// gMap have to be global
var gMap;

$(() => {
  
  // Setup Google Map
  initializeMap();

  // Temp just for tests 
  const GOOGLE_MAPS_API_KEY = "AIzaSyDI8FP3X9PwHVkNw-HrhfGGBBh1mGMWC4o";
  
  
  var mapMarker;
  var markersArray = [];

  function initializeMap(){
    let coordinates = new google.maps.LatLng(-27.599360, -48.519192);
    let options = {
      zoom: 19,
      center: coordinates,
      mapTypeId: 'satellite'
    }
    
    gMap = new google.maps.Map(document.getElementById("map"), options);

    fillFreeParks();
  
  };

  function fillFreeParks(){
    $.get('/sense', function(data){
      for(var i in data.data){
        createMapMarker(data.data[i].geoLocation);
      }

    });
  };



  // Setup Feathers
  var socket  = io();
  var app     = feathers();

  app.configure(feathers.socketio(socket));

  var sense = app.service('sense');

  // On CREATE
  sense.on('created', function(s){
    console.log("Sense: ", s)
    createMapMarker(s.geoLocation);
  });

  // On REMOVE
  sense.on('removed', function(s){
    console.log(s);
    removeMapMarker(s.geoLocation);
  });



  function createMapMarker(geoLocation){
    let coordinates = new google.maps.LatLng(geoLocation.lat, geoLocation.lon);
    let id = generateMapMarkerId(geoLocation);
    let mapMarker = new google.maps.Marker({
      id:id,
      map: gMap,
      draggable: true,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        strokeColor: "green",
        scale: 3
      },
    });
    mapMarker.setPosition(coordinates);
    markersArray.push(mapMarker);

  };

  function removeMapMarker(geoLocation){
      let id = generateMapMarkerId(geoLocation);
      for(let i=0, marker; marker=markersArray[i]; i++)
        if(marker.id == id)
          marker.setMap(null);
  }

  function generateMapMarkerId(geoLocation){
    return geoLocation.lat+""+geoLocation.lon;
  }



  // TEST FUNCTIONS
  function sendSenseNotEmpty(geoLocation){
    sense.create({
      '_id': generateMapMarkerId(geoLocation),
      'geoLocation': geoLocation
    });
  }

  function sendSenseEmpty(geoLocation){
    sense.remove(generateMapMarkerId(geoLocation));
  }

  const geoLocationList = [
    // BU
    {'lat': -27.599645, 'lon': -48.518818},
    {'lat': -27.599770, 'lon': -48.519370},
    // CCS
    {'lat': -27.599370, 'lon': -48.518234},
    // CSE
    {'lat': -27.599484, 'lon': -48.518074},
    {'lat': -27.599870, 'lon': -48.522223},
  ];
  

  // Call random sense
  setInterval(
    ()=>{
      let geoLocationIndex = Math.floor(Math.random() * 10)%5;
      let emptyFlag        = Math.random() >= 0.5
      
      if(!emptyFlag)
        sendSenseNotEmpty(geoLocationList[geoLocationIndex]);    
      else
        sendSenseEmpty(geoLocationList[geoLocationIndex]);    
    },

    3000)

  // sendSenseNotEmpty({'lat': -27.599645, 'lon': -48.518818 });
  // sendSenseEmpty({'lat': -27.599645, 'lon': -48.518818 });

});