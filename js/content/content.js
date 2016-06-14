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
		* declare base potential currency variable
	**/
	let potential_currency = undefined;
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
				
				/**
					* check the existence of either a comma or period in string
				**/
				let matches = s(int[0], ['.', ',']);
				/**
					* check that array was populated
				**/
				if (matches.length) {
					/**
						* check if array is longer than one
						* prevents false flag value of, e.g. 1,000 being converted to 1.000
					**/
					if (matches.length > 1) {
						/**
							* obtain last index of array
						**/
						let lastIndex = matches[matches.length - 1];
						/**
							* format European decleration (replace trailing comma with period)
						**/
						if (lastIndex.character === ",") {
							int[0] = int[0].replace(/\./g, "").replace(/\,/g, ".");
						}
						/**
							* format regular decleration (replace leading commas)
						**/
						else if (lastIndex.character === ".") {
							int[0] = int[0].replace(/\,/g, "");
						}
						/**
							* otherwise remove specia characters
						**/
						else {
							int[0] = int[0].replace(/[,]/g, "");
						}

					}
				}

				/**
					* perform final cleanup on remaining commas
				**/

				int[0] = int[0].replace(/\,/g, "");

				potential_currency = int[0];

			}
			
		}
	}
	/**
		* otherwise attempt to check if string is a potential number
	**/
	else if (!isNaN(text)) {
		potential_currency = text;
	}
	/**
		* return computed outcome
	**/
	return potential_currency;
};
/**
	* substring index
**/ 
this.s = function (text, characters) {
	if (!text || !characters) {
		return;
	}
	/**
		* temp array to hold found matches
	**/
	let matches = [];
	/**
		* iterate through provided string
	**/
	for (let i = 0; i < text.length; i++) {
		/**
			iterate through matches array
		**/
		for (let k = 0; k < characters.length; k++) {
			/**
				if text matches user supplied matches add to temp array
			**/
			if (text[i] === characters[k]) {
				matches.push({
					character: characters[k],
					position: i
				});
				break;
			}
		};
	};
	return matches;
};

this.matchCurrency = function (data) {
	let node = data.node;
	let text = data.text;

	console.log(text);
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
						
						/* original v */
						/*
						let words = node.nodeValue.split(new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/)).filter(function (n) { return /\S/.test(n); });
						*/

						/**
							* use prototype split method to get substrings and index of split substring
						**/

						let words = node.nodeValue.splitIndex(new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/));

						/**
							* append to array of clean strings 
						**/
						if (words.length) {
							clean_strs.push({ textNode: node, textNodeWords: words });
						}
					}

				}(nodes[i]);
			};
		}, function () {
			/**
				* create primary async function to reduce page load
			**/
			a(function () {
				/**
					* iterate over cleaned/valid strings from document Tree Walker
				**/
				for (let i = 0; i < clean_strs.length; i++) {
					/**
						* supply individual string to anonymous function for evaluation
					**/
					!function (clean) {
						/**
							* secondary async to attempt to lighten computational delay 
						**/
						a(function () {
							/**
								* iterate over individual items in cleaned words array individual word list
								* it's a bit of a mouthful, basically this:
									cleaned_strs - 
										clean_strs_item -
											clean_strs_items_words < iterate over this

							**/
							for (let k = 0, words = clean.textNodeWords; k < words.length; k++) {
								let position = words[k][0];
								let word = words[k][1];
								/**
									* evaluate current word in word list against currency string identifier 
								**/
								let potential = m(word);
								/**
									* process if not undefined
								**/
								if (potential) {

									let data = {
										text: {
											original: word,
											formatted: potential,
											position: position
										},
										node: clean.textNode.parentElement
									};
									/**
										* assumes we used splitIndex
										* appends item before
									**/
									if (words[k - 1]) {
										data.text.before = words[k - 1][1]
									}
									/**
										* assumes we used splitIndex
										* appends item after
									**/
									if (words[k + 1]) {
										data.text.after = words[k + 1][1];
									}	
									/**
										* dispatch to matchCurrency major function
									**/
									window.matchCurrency(data);
								}
							}
						});

					}(clean_strs[i]);

				};	

			});

			//console.log("finished iterating over cleanstrs!!");

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