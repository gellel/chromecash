this.countries__data = undefined;

this.fetchJSON = function (callback) {
	if (!window.countries__data || window.countries__data === null) {
		if (localStorage.getItem("countries__json") !== null) {
			window.countries__data = JSON.parse(localStorage.getItem("countries__json"));

			fetchJSON(callback);
		}
		else {
			let xhr = new XMLHttpRequest();
				xhr.addEventListener("readystatechange", function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							localStorage.setItem("countries__json", xhr.responseText);
							window.countries__data = JSON.parse(xhr.responseText);

							fetchJSON(callback);
						}
					}
				}, false);
				xhr.open("GET", chrome.extension.getURL("js/json/countries/countries.json"), false);
				xhr.send();
		};
	}
	else {
		callback(window.countries__data);
	};
};

/*
	* awaits tabsOnUpdate to complete before operating
	* declare the eventListener for Messages to allow flexible requests for functions
*/
this.init = function () {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (typeof request === "object") {
			if (request.message_type) {
				if (request.message_type === "function_request") {
					if (window[request.function_name]) {
						window[request.function_name](function (returnedData) {		
							sendResponse({c: chrome, s: sender, d: returnedData});
						});
					}
				}
			}
		}
	});
};

/**
	* primary initaliser
	* asks tab[id] to initalise content functions
**/
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		chrome.tabs.sendMessage(tabId, {meta: {status: "tab_ready", tabId: tabId}}, function () {
			window.init();
		});
	}
});
