this.p = function (url) {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));
				}
				else {
					reject(xhr);
				}
			}
		};
		xhr.open("GET", url, false);
		xhr.send();
	});
};

/**
	* general handler for background script
	* operates via checking if the selected tab is ready (all content finished loading)
	* executes ajax request for countries.json 
**/
chrome.tabs.onUpdated.addListener(function (tabId, changeInformation, tab) {
	if (changeInformation.status === "complete") {
		p(chrome.extension.getURL("js/json/countries/countries_common.json")).then(function (countries_common) {
			chrome.tabs.sendMessage(tabId, {tab: tab, meta: {status: "ready"}, countries: countries_common});
		});
	} 
});