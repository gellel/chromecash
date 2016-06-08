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
	if (!countries__data) {
		countries__data = localStorage.getItem("countries_json");

		if (countries__data) {
			callback(countries__data)
		}
		else {

			/** **/

			let countries__path = chrome.extension.getURL("js/json/countries/countries.json");

			let xhr = new XMLHttpRequest();

		}
	}
	else {
		callback(countries__data);
	}
};
	
/**
	* general cross script service worker accepts messages from content scripts
	* handles supplied request relative to the outcome desired such as requesting data through a function
**/


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	let response__data = { tabdId: sender.tab.id, meta: { status: { message: undefined }} };

	if (typeof request === "object") {


		if (Object.keys(request).length === 0) {

			response__data.meta.status.message = "No abstraction supplied.";

			sendResponse(response__data);

		}

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