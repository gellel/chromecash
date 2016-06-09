/**
	* retrieve JSON data from background.js
	* hypothetically cached in background.js memory
**/
this.init = function () {
	let countries__data = chrome.runtime.sendMessage({message_type: "function_request", function_name: "fetchJSON"}, function (response) {
			console.log(response);
	});
};

/**
	* activated from background.js
	* unique response to tab content.js is operating on
**/
chrome.runtime.onMessage.addListener(function (request, sender, sendMessage) {
	if (typeof request === "object") {
		if (request.meta) {
			if (request.meta.status === "tab_ready") {
				window.init();
			}
		}
	}
});