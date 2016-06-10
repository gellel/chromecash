this.a = function (funct, callback) {
	let t = window.setTimeout(function () {
		funct();
		callback();
		window.clearInterval(t);
	}, 0);
};

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

	let d = request.r;

	c(document.body, function (nodes) {

		window.a(function () {
			/**
				* initial top loop of content nodes
			**/
			for (let i = 0; i < nodes.length; i++) {
				/**
					* scopes function for evaluations of substrings
				**/
				!function (node) {
					let str = node.nodeValue;
					//[a-zA-Z0-9.,]+
					// /[_+\-!?@#%^&*();:\/|<>"'{}/\n/\ \t]/
					let words = str.split(new RegExp(/\s|[\_\+\-!@#$%^&*():;\\\/|<>"'\n\t]+/)).filter(Boolean);

					console.log('w:', words);
					/**
						* iterate through this nodes words 
					**/
					//for (let k = 0; k < words.length; k++) {
					//	console.log(words[k])
					//}
				}(nodes[i]);
			};
		}, function () {
			console.log("truly async? finished!!");
		});
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