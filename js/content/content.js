
chrome.runtime.sendMessage({}, function (currencies) {

	/***
	 *** Content script send message to event script.
	 *
	 * 
	 * Assumed response success.
	 * Currencies object returned from event script.
	 *
	 */
	
	ChromeCash.currency(ChromeCash.tree(document.body), currencies);
});
