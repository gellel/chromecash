this.countries__data = undefined;

this.l = function (callback) {
	if (!countries__data) {
		let url = chrome.extension.getURL("js/json/countries/countries.json");
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {	
					countries__data = JSON.parse(xhr.responseText);
					callback(countries__data);
				}
			}
		};
		xhr.open("GET", url, false);
		xhr.send();
	}
	else {
		callback(countries__data);
	}
}

/**
	* general handler for background script
	* operates via checking if the selected tab is ready (all content finished loading)
	* executes ajax request for countries.json 
**/
chrome.tabs.onUpdated.addListener(function (tabId, changeInformation, tab) {
	if (changeInformation.status === "complete") {
		l(function (r) {
			chrome.tabs.sendMessage(tabId, {tab: tab, meta: {status: "ready"}, r: r}, function () {
				if (!countries__data) countries__data = r;
			});
		});
	} 
});