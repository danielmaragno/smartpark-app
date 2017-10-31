
var request = require('request');
var base_payload = require('./base_payload');

module.exports = function(app){

	// Sense instance
	var sense = app.service('sense');

	let t = setInterval(findSenses, 3000);
	clearInterval(t);


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
		payload.series.t0 = epoch - (1*60*1000000);
		payload.series.t1 = epoch;
		console.log(payload);

		console.log("Request for",s.x,s.y,s.z)
		request.post({
			"url": "http://iot.lisha.ufsc.br/api/get.php",
			"form": JSON.stringify(payload)
		},
		(err, httpResponse, body)=>{
			if(httpResponse.statusCode == 200){
				let data = JSON.parse(body);
				
				if(data.series.length)
					updateSense(data.series[0]);

			}
			else{
				console.log(err);
				console.log(httpResponse.statusCode);
			}
		});

	};

	function updateSense(s_iot){
		console.log(s_iot);
	}
	

}