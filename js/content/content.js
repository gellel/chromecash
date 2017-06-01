

chrome.runtime.sendMessage({}, function (currencies) {
	
	ChromeCash.currency(ChromeCash.tree(document.body), currencies);
});
