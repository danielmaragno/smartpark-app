"use strict";

var app = angular.module("App", []);


// Map Controller
app.controller("mapController", ($scope)=>{

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
	}

});
