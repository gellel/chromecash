
chrome.runtime.sendMessage({}, function (currencies) {

	/***
	 *** Send message to event script.
	 *
	 * Fetch currency data.
	 * Process page text nodes.
	 *
	 */
	
	ChromeCash.currency(ChromeCash.tree(document.body), currencies);
});
