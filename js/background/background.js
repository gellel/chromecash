let t = "test";


chrome.runtime.onMessage.addListene(function(request, sender, sendResponse) {
  
	sendResponse({ t: t });

});