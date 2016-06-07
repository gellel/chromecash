!function () {
	"use strict";



	!function (callback) {

		callback();

	}(init);


	function init () {

		chrome.runtime.sendMessage({message_type: "function_request", function_name: "fetchCountryJSON"}, function (response) {

			console.log("content.js send message received response:", response);

			localStorage.removeItem("countries__json");

		});

		window.addEventListener("click", function () {
			chrome.runtime.sendMessage({}, function (x) {

				console.log(x);

			});

		}, false);

	};


}();