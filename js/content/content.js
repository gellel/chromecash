!function () {
	"use strict";



	!function (callback) {

		/**
			* retrieve local instance of countries data
			* if data does not exist locally, fetch from resources countries.json
			* set and store for future instances
		**/
		
		let countries__data = localStorage.getItem("countries__json");


		if (!countries__data) {

			let countries__path = chrome.extension.getURL("js/json/countries/countries.json");

			let xhr = new XMLHttpRequest();

			xhr.open("GET", countries__path, true);
			
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					countries__data = (xhr.status === 200) ? xhr.responseText : undefined;

					if (countries__data) {
					
						localStorage.setItem("countries__json", countries__data);
					}

					callback(countries__data);
				}
			};

			xhr.send();

		}
		else {

			callback(countries__data);

		}


	}(init);


	function init (countries__data) {

		countries__data = JSON.parse(countries__data);

		chrome.runtime.sendMessage({a: "test"}, function (a) {

			console.log(a);

		})

		//localStorage.removeItem("countries__json");

	};


}();