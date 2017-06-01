	

XHR.GET(chrome.extension.getURL("json/currencies/currencies.json"))

.then(function (xhr) {

	/** xhr get success. **/

	/** parse json from extension file. **/
	let response = JSON.parse(xhr.responseText);
	/** register event page message handler. **/
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		/** send currencies object. **/
		sendResponse(response.currencies);
	});
})

.catch(function (xhr) {
	console.log("xhr error:", xhr);
});
