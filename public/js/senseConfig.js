"use strict";

function senseConfig() {
	// Setup Feathers
  var socket  = io();
  var app     = feathers();

  app.configure(feathers.socketio(socket));

  var sense = app.service('sense');

    // On CREATE
  sense.on('created', function(s){
    console.log("Sense: ", s)
    createMapMarker(s);
  });

  // On UPDATE
  sense.on('updated', function(s){
    console.log("Updated: ", s);
    updateMapMarker(s);
  });

  // On REMOVE
  sense.on('removed', function(s){
    console.log(s);
    removeMapMarker(s._id);
  });

  return sense;

}