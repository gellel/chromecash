

chrome.runtime.sendMessage({}, function (response) {
	
	ChromeCash.currency(ChromeCash.tree(document.body), response.currency);
});
