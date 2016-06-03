let t = "test";


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
	sendResponse({ t: t });

});