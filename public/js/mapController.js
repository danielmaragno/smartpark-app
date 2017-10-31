"use strict";


// map Controller function
function mapController($scope){
	
	// Configure Sense 
	var sense = senseConfig();
	// Initialize gMap
	var gMap = InitializeMap();


	// initialize controller
	$scope.map = "BU";

	$scope.changeMap = function(map_string){
		$scope.map = map_string;
		
		switch(map_string){
			case "CCS" :
				gMap.setCenter(new google.maps.LatLng(-27.599370, -48.518067));
				break;
			case "CTC":
				gMap.setCenter(new google.maps.LatLng(-27.600736, -48.518186));
				break;
			case "BU":
				gMap.setCenter(new google.maps.LatLng(-27.599360, -48.519192));
				break;
			default:
				break;
		}
	};

	// handleMapClick
	handleMapClick(sense);


	// TEST AREA

	// Update 
	  function updateSpotAvailability(id, emptyFlag){
	    sense.update(id, {
	      '$set':{
	        'empty': emptyFlag
	      }
	    });
	  }
	  

	  // LIST
	  var sense_list = [
	  	"678",
	  	"123"
	  	];

	  // Call random sense
	  let t =setInterval(
	    ()=>{
	      let idIndex = Math.floor(Math.random() * 10)%2;
	      let emptyFlag = Math.random() >= 0.5
	      
	      updateSpotAvailability(sense_list[idIndex], emptyFlag);
	    },

	    3000);
	  // clearInterval(t);

};
