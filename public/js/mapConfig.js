"use strict";


// Declare Global Vars
var gMap;
var mapMarker;
var markersArray = [];

// let baseIcon = {
// 	path: google.maps.SymbolPath.CIRCLE,
// 	strokeColor: '',
// 	scale: 3
// };

let baseIcon = {
	scaledSize: new google.maps.Size(15, 20),
	origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};


function InitializeMap(){
	
	// Temp just for tests 
	const GOOGLE_MAPS_API_KEY = "AIzaSyDI8FP3X9PwHVkNw-HrhfGGBBh1mGMWC4o";

	// Setup Google Map
	let coordinates = new google.maps.LatLng(-27.599360, -48.519192);
    let options = {
      zoom: 19,
      center: coordinates,
      mapTypeId: 'satellite'
    }
    
    gMap = new google.maps.Map(document.getElementById("map"), options);

    fillFreeParks();

    return gMap;

};

function fillFreeParks(){
    $.get('/sense', function(data){
      for(var i in data.data){
        createMapMarker(data.data[i]);
      }

    });
};

function createMapMarker(s){
    let geoLocation = s.geoLocation;
    
    let coordinates = new google.maps.LatLng(geoLocation.lat, geoLocation.lon);
    let icon = baseIcon;
    // icon.strokeColor = !('empty' in s) ? "yellow" : s.empty ? "green" : "red";
    icon.url = !('empty' in s) ? "park_icons/vaga_com_problema.png" : s.empty ? "park_icons/vaga_livre.png" : "park_icons/vaga_ocupada.png";
    let id = s._id;
    
    let mapMarker = new google.maps.Marker({
      id:id,
      map: gMap,
      draggable: true,
      icon: icon,
    });
    mapMarker.setPosition(coordinates);
    markersArray.push(mapMarker);
};

function updateMapMarker(s) {
    let id = s._id;
    for(let i=0, marker; marker=markersArray[i]; i++)
      if(marker.id == id){
        let icon = baseIcon;
        icon.url = s.empty ? "park_icons/vaga_livre.png" : "park_icons/vaga_ocupada.png";
        marker.setIcon(icon);
      }
}

function removeMapMarker(id){

    for(let i=0, marker; marker=markersArray[i]; i++)
      if(marker.id == id)
        marker.setMap(null);
}

function handleMapClick(sense){

	// handle gMap click
  gMap.addListener('click', function(event){
    let geoLocation = {
      "lat": event.latLng.lat(),
      "lon": event.latLng.lng()
    }
    console.log(geoLocation);

    // handle modal
    let modal = $("#newSpotModal");
    modal.find("input[name='id']").val("");
    modal.find("input[name='lat']").val(geoLocation.lat);
    modal.find("input[name='lon']").val(geoLocation.lon);
    modal.modal('show');
  });



  // handle Adicionar Vaga
  $("#newSpotModal button[name='adicionarVaga']").click(()=>{
      // find modal
      let modal = $("#newSpotModal");

      // get form values
      let x = modal.find("input[name='x']").val();
      let y = modal.find("input[name='y']").val();
      let z = modal.find("input[name='z']").val();
      let geoLocation = {
        "lat": modal.find("input[name='lat']").val(),
        "lon": modal.find("input[name='lon']").val()
      };

      // 
      let s = {
      	"_id": x+y+z,
        "geoLocation": geoLocation,
        "x": parseInt(x),
        "y": parseInt(y),
        "z": parseInt(z)
      };

      sense.create(s);

      // hide modal
      modal.modal('hide');
    
    });

}