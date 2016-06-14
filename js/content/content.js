/**
	* async anonymous function handler
**/
this.a = function (funct, callback) {
	let t = window.setTimeout(function () {
		funct();
		if (callback) callback();
		window.clearInterval(t);
	}, 0);
};
/**
	* document tree node walker
**/
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
		callback(nodes);
	}
	return nodes;
};
/**
	* node filter
**/
this.f = function (element) {
	let tagNames = ["STYLE","SCRIPT", "NOSCRIPT", "PRE", "IMG", "CANVAS", "CODE", "ABBR", "TIME", "TEXTAREA", "INPUT", "OPTION", "AUDIO", "SOURCE", "VIDEO", "TRACK", "FORM"];
	for (let i = 0; i < tagNames.length; i++) {
		if (element.tagName === tagNames[i]) {
			return true;
		}
	};
	return false;
};
/**
	* currency formatter 
**/	
this.m = function (text) {
	/**
		* check if str contains index of . or ,
	**/	
	if (text.indexOf('.') > -1 || text.indexOf(',') > -1) {
		/**
			* test if . repeats
		**/
		let decimals = text.match(/[.,]/g) || [];
		/**
			* if decimals were found
		**/
		if (decimals.length) {
			/**
				* check if string matches integer
				* 
					(non-capture begins with any number of digits) 
					(followed by digit any number of times) or (comma or period) repeated pattern
					(followed by a digit any number of times) {not the currencies disperse that low}

				* otherwise set undefined
			**/
			let int = text.match(/(?:\d+)(\d+|[,.])+\d+/g) || undefined;

			if (int) {
				//console.log('pass:', int[0]);

				//s(int[0])

				let matches = s(int[0], ['.', ',']);

				console.log(matches)
			}
			
			/*
			if (int) {
				//console.log("i", int[0].match(/((\d|[,.])+)\d+[,.]\d+/g));
				if (int[0].match(/((\d|[,.])+)\d+[,.]\d+/g)) {
					console.log('prol:', int[0])
				}
				else {
					console.log('nah:', int[0])
				}
			}
			*/

		}
		else {
			console.log('n repeat:', text)
		}
	}

//	console.log(text, (text.indexOf('.') > -1) || (text.indexOf(',') > -1) );

	//console.log( (text.match(/\./g)) ? true : false );

	/*
	if ((text.indexOf('.') > -1)) {

		console.log("this text has a period", text)
	} 
	else if ((text.indexOf(',') > -1)) {
		console.log("has a comma", text);
	}
	else if (parseInt(text)) {
		console.log("is a valid int", text);
	}
	else {
		return false;
	}
	*/
};
/**
	* substring index
**/ 
this.s = function (text, characters) {
	let matches = [];
	for (let i = 0; i < text.length; i++) {
		for (let k = 0; k < characters.length; k++) {
			if (text[i] === characters[k]) {
				matches.push({
					character: characters[k],
					position: i
				});
			}
		}
	};
	return matches;
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
				* create primary async function to reduce page load
			**/
			a(function () {
				for (let i = 0; i < clean_strs.length; i++) {
					!function (clean) {
						/**
							* secondary async to attempt to lighten page 
						**/
						a(function () {
							for (let k = 0; k < clean.textNodeWords.length; k++) {

								let pre = clean.textNodeWords[k - 1];
								let mid = clean.textNodeWords[k];
								let aft = clean.textNodeWords[k + 1];

							//	console.log("str:", pre, mid, aft, "\n");

							m(mid);

								/** 
									* begin string evaluation
								**/
								/*
								console.log("is number:", !isNaN(clean.textNodeWords[k]));
								console.log("text value:", clean.textNodeWords[k]);
								console.log("");
								*/
								//console.log("is word a number:", !isNaN(clean.textNodeWords[k]))
								//console.log("async:", k + ":", clean.textNodeWords[k])

								//if (isFloat(clean.textNodeWords[k]) || isInteger(clean.textNodeWords[k])) {
									//console.log("is valid:", clean.textNodeWords[k])

								
								//}
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