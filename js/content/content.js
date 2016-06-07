!function () {
	"use strict";



	!function (callback) {

		callback();

	}(init);


	function init () {

		/*
			str req:

				starts with either: 
					* valid currency identifier
					* integer 

				between:
					* integer punctuated by:
						* -
						* ,
						* .

				ends with either:
					* valid integer:
						* followed by: 
					<---------
					|		
					-->	* valid currency abbr
	
		*/



		/*
		chrome.runtime.sendMessage({message_type: "function_request", function_name: "fetchCountryJSON"}, function (a) {

			console.log(a)

		});
		
		*/
	};


}();