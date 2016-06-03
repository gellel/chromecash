/**
	* global instance of countries__data to be shared
**/

let countries__data = undefined;

function fetchCountryJSON (callback) {

	/**
		* retrieve local instance of countries data
		* if data does not exist locally, fetch from resources countries.json
		* set and store for future instances
		*
		* @param function 	acts as callback response handler for shared data to content.js
	**/

	countries__data = countries__data || localStorage.getItem("countries__json") || undefined;

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

				callback(JSON.parse(countries__data));
			}
		};

		xhr.send();

	}
	else {

		if (typeof countries__data === "string") {
			countries__data = JSON.parse(countries__data)
		}

		callback(countries__data);

	};
	
};
	
/**
	* general cross script service worker accepts messages from content scripts
	* handles supplied request relative to the outcome desired such as requesting data through a function
**/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if (request) {

		let tabId = sender.tab.id;

		if (request.message_type === "function_request") {

			if (!request.function_name) {
				sendResponse({ tabId: tabId, meta: {status: { msg: "missing function name"}} });
			}
			else {
				window[request.function_name](function (returned__data) {

					//sender.tab.id
				
					sendResponse({ tabId: tabId, meta: {status: { msg: "success"}}, data: returned__data });

				});
			}
		}

	}

});