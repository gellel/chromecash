this.a = function (funct, callback) {
	let t = window.setTimeout(function () {
		funct();
		if (callback) callback();
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

this.f = function (element) {
	let tagNames = ["STYLE","SCRIPT", "NOSCRIPT", "PRE", "IMG", "CANVAS", "CODE", "ABBR", "TIME", "TEXTAREA", "INPUT", "OPTION", "AUDIO", "SOURCE", "VIDEO", "TRACK", "FORM"];

	for (let i = 0; i < tagNames.length; i++) {
		if (element.tagName === tagNames[i]) {
			return true;
		}
	}
	return false;
};

this.init = function (request, callback) {

	let json_data = request.r;

	c(document.body, function (nodes) {

		let clean_strs = [];

		a(function () {

			/**
				* non whitespace strings
			**/
			/**
				* initial top loop of content nodes
			**/
			for (let i = 0; i < nodes.length; i++) {
				/**
					* scopes function for evaluations of substrings
				**/
				!function (node) {
					/**
						* check parent node against registered elements to reduce array load
						* filters against type, e.g. exclude <script> text
					**/
					if (!f(node.parentElement)) {
						/**
							* split words based on their position between spaces or special characters
							* using characters that are unlikely to be used to declare a currency
						**/
						let words = node.nodeValue.split(new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/)).filter(function (n) { return /\S/.test(n); });

						/**
							* append to array of clean strings 
						**/
						if (words.length) {
							clean_strs.push({ textNode: node, textNodeWords: words });
						}
					}


					/*
					if (node.parentElement.tagName !== "NOSCRIPT" || node.parentElement.tagName !== "SCRIPT" || node.parentElement.tagName !== "PRE") {
						let words = node.nodeValue.split(new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/)).filter(function (n) { return /\S/.test(n); });

						if (words.length) {
							clean_strs.push({ node: node, words: words});
						}

					}

					/*
					let node_words = node_str.split(new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/)).filter(function (n) {
						return /\S/.test(n);
					});

					if (node_words.length) {
						clean_strs.push({ parentElement: node.parentElement, words: node_words, node: node });
					}
					*/
				
					/**
						* iterate through this nodes words 
					**/
					//for (let k = 0; k < words.length; k++) {
					//	console.log(words[k])
					//}
				}(nodes[i]);
			};
		}, function () {
			/**
				create primary async function to reduce page load
			**/
			a(function () {
				for (let i = 0; i < clean_strs.length; i++) {
					!function (clean) {
						/**
							secondary async to attempt to lighten page 
						**/
						a(function () {
							for (let k = 0; k < clean.textNodeWords.length; k++) {
								console.log("async:", k + ":", clean.textNodeWords[k])
							}
						});

					}(clean_strs[i]);

				}	

			});

			//console.log("async clean:", clean_strs);

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