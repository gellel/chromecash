this.c = function (element, callback) {
	let c = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, "", false);
	let r = new RegExp(/^\s*$/);
	let n;
	let nodes = [];
	while (n = c.nextNode()) {
		if (!r.test(n.nodeValue)) {
			nodes.push(n);
		}
	}
	if (callback) {
		callback(nodes)
	}
	return nodes;
};

this.init = function (request, callback) {

	let floatregex = /(?:\d*\.)?\d+/;

	c(document.body, function (nodes) {
		console.log(nodes);
	});
};

/**
	* general message response handler between content.js and background.js
	* primary operation to intilise content scripts after background scripts are set and tabs are ready
**/
chrome.runtime.onMessage.addListener(function (request, sender, sendMessage) {
	if (typeof request === "object") {
		if (Object.keys(request).length) {
			if (request.meta) {
				/**
					* anticipates status to indicate first operation of script
					* relies on background.js initialisation
				**/
				if (request.meta.status && request.meta.status === "ready") {
					window.init(request);
				}
			}
		}
	}
});