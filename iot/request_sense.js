
var request = require('request');
var base_payload = require('./base_payload');

module.exports = function(app){

	// Sense instance
	var sense = app.service('sense');

	let t = setInterval(findSenses, 3000);
	clearInterval(t);


	findSenses();
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
		payload.series.t0 = epoch - (1*60*1000000);
		payload.series.t1 = epoch;
		console.log(payload);

		console.log("Requesting...")
		request.post({
			"url": "http://iot.lisha.ufsc.br/api/get.php",
			"form": JSON.parse(JSON.stringify(payload))
		},
		(err, httpResponse, body)=>{
			console.log(err);
			console.log(httpResponse.statusCode);
			console.log(body);
		});

	};
	

}