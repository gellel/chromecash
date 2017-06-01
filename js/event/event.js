	

XHR.GET(chrome.extension.getURL("json/currency/currency.json"))

.then(function (xhr) {

	let response = JSON.parse(xhr.responseText);

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		sendResponse(response);
	});
})

.catch(function (xhr) {
	console.log("xhr error:", xhr);
});
