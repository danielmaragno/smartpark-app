
var fs = require('fs');
var path = require('path');
var certFile = path.resolve('./iot/cert.pem');
var request = require('request');
var base_payload = require('./base_payload');

module.exports = function(app){

	// Sense instance
	var sense = app.service('sense');

	let t = setInterval(findSenses, 2000);
	// clearInterval(t);


	// findSenses();
	function findSenses(){
		sense.find().then(items => {
			
			let data = items.data;
			if(data.length){

				for(let i=0, s; s=data[i++];){
					findIoTsense(s);
				}

			}

		});	
	};

	function findIoTsense(s){
		let payload = base_payload;
		
		let epoch = Date.now()*1000;
		
		payload.series.x = s.x;
		payload.series.y = s.y;
		payload.series.z = s.z;
		payload.series.t0 = epoch - (3*1000000); // last 3 seconds
		payload.series.t1 = epoch + (2*1000000); // 2 seconds gap to future, fix unsync clock problem
		// console.log(payload);

		console.log("Request for",s.x,s.y,s.z)
		request.post({
			"url": "https://iot.lisha.ufsc.br/api/get.php",
			"form": JSON.stringify(payload),
			"agentOptions": {
				"key": fs.readFileSync(certFile),
				"securityOptions": 'SSL_OP_NO_SSLv3'
			}
		},
		(err, httpResponse, body)=>{
			if(httpResponse.statusCode == 200){
				let data = JSON.parse(body);
				// console.log(data);

				let series = data.series;
				
				// Sensor send data
				if(series.length){
					// console.log(series);
					updateSense(series[series.length-1]);
				}

				// Sensor do not send any data, PROBLEM
				else
					updateSense({"x": s.x, "y": s.y, "z": s.z, "value": 0});

			}
			else{
				console.log(err);
				console.log(httpResponse.statusCode);
			}
		});

	};

	function updateSense(s_iot){
		// console.log(s_iot);

		let id 		= s_iot.x + "" + s_iot.y + "" + s_iot.z;
		let data = {}

		if(s_iot.value){
			let empty = parseInt(s_iot.value) <= 10 ? false : true;
			data = {
				"$set": {
					"empty": empty
				}
			}
		}
		else{
			data = {
				"$unset" :{
					"empty": true
				}
			}
		}


		// console.log(data);
		
		sense.update(id, data).then(handleSenseUpdate);
	};

	function handleSenseUpdate(data){
		console.log("[DADO ATUALIZADO]  id:", data._id, "| empty:", data.empty);
	};
	

}