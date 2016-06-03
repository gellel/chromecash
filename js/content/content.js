!function () {
	"use strict";



	!function (callback) {

		callback();

	}(init);


	function init () {

		
		chrome.runtime.sendMessage({message_type: "function_request", function_name: "fetchCountryJSON"}, function (a) {

			console.log(a);

		})

	};


}();