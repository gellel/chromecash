this.async__array = function (array, funct) {
	/**
		* requires array for binding
		* function to bind to each item of array
		* function expected to handle individual item, not group (subgroups of parent can be iterated)
	**/
	array = array.map(function (item) {
		/** 
			* asynchronise event
		**/
		return new Promise(function (resolve) {
			return setTimeout(resolve(funct(item)), 0);
		});
	});
	return Promise.all(array);
};

this.async__function = function (funct) {
	/**
		* requires function (either called or uncalled);
	**/
	return new Promise(function (resolve) {
		return setTimeout(resolve((typeof funct === "function") ? funct() : funct), 0);
	});
};


this.tree__walker = function (element, callback) {
	/**
		* collect DOM nodes
	**/
	let element_filter = function (element) {
		let tagNames = ["STYLE","SCRIPT", "NOSCRIPT", "PRE", "IMG", "CANVAS", "CODE", "ABBR", "TIME", "TEXTAREA", "INPUT", "OPTION", "AUDIO", "SOURCE", "VIDEO", "TRACK", "FORM"];
		for (let i = 0; i < tagNames.length; i++) {
			if (element.tagName === tagNames[i]) {
				return true;
			}
		};
		return false;
	};

	let c = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, "", false);
	let r = new RegExp(/^\s*$/);
	let n;
	let nodes = [];

	while (n = c.nextNode()) {
		if (!element_filter(n.parentElement)) {
			if (!r.test(n.nodeValue)) {
				nodes.push(n);
			}
		}
	}
	if (callback) {
		callback(nodes);
	}
	return nodes;
};
/**
	* flexible string filter
**/
this.str__filter = function (text, characters) {
	if (!text || !characters) {
		return;
	}
	/**
		* temp array to hold found matches
	**/
	let str_matches = [];
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
				str_matches.push({ character: characters[k], position: i });
				break;
			}
		};
	};
	return str_matches;
};

this.str__words = function (node) {
	let words = node.nodeValue.splitIndex(new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/));

	return (words.length) ? { node: node, words: words } : false;
};

this.str__currency = function (text) {
	
		//console.log(text)
	
	/**
		* declare base potential currency variable
	**/
	let potential = undefined;
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
					(followed by a digit any number of times) or (one period) {not the currencies disperse that low}

				* otherwise set undefined
			**/
			let int = text.match(/(?:\d+)(\d+|[,.])+(\d+|\.{1})/g) || undefined;

			if (int) {
				
				/**
					* check the existence of either a comma or period in string
				**/
				let filter_matches = str__filter(int[0], ['.', ',']);
				/**
					* check that array was populated
				**/
				if (filter_matches.length) {
					/**
						* check if array is longer than one
						* prevents false flag value of, e.g. 1,000 being converted to 1.000
					**/
					if (filter_matches.length > 1) {
						/**
							* obtain last index of array
						**/
						let lastIndex = filter_matches[filter_matches.length - 1];
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
							* otherwise remove special characters
						**/
						else {
							int[0] = int[0].replace(/[.,]/g, "");
						}
					}
				}

				/**
					* perform final cleanup on remaining commas
				**/

				int[0] = int[0].replace(/\,/g, "");

				potential = int[0];

			}
			
		}
	}
	/**
		* otherwise attempt to check if string is a potential number
	**/
	else if (!isNaN(text)) {
		potential = text;
	}
	/**
		* return computed outcome
	**/
	return potential;
};

this.str__identifier = function (text, patterns, json) {
	let str_match = false;
	/**
		* iterate over provided json document that has a currency object for each item
	**/
	for (let i = 0; i < json.length && !str_match; i++) {
		/**
			* extract the currency object for [i]
		**/
		let currency = json[i].currency;


		for (var k = 0; k < patterns.length; k++) {
			
			let format = currency[patterns[k]];

			if (format) {
				let r; 
				for (let key in text) {
					try {
						r = ("/\\" + format + "/gi").test(text[key]);
					} catch (err) {
						r = new RegExp(format, "gi").test(text[key]);
					}
					if (r) {
						str_match = currency.ISO;
					} 
				};
			}
		};

	};
	return str_match;
};


this.try__match = function (argument) {
	
};

this.init = function (request, callback) {
	/**
		* abort operation if JSON not recovered
	**/
	if (!request.countries) return;
	/**	
		* asynchronously collect relevant DOM nodes (ignoring unlikely currency holders)
	**/
	async__function(tree__walker(document.body)).then(function (nodes) {
		/**
			* asynchronously split assumed seperated words from DOM nodes based on RegExp
		**/
		async__array(nodes, str__words).then(function (nodes) {
			/**
				* filter empty arrays from nodes 
			**/
			nodes = nodes.filter(Boolean);
			/**
				* temp array for potential currency strings
			**/
			let possible = [];
			/**
				* iterate over filtered collected nodes
			**/
			async__array(nodes, function (node) {
				/**
					* asynchronise individual node for complex string evaluation
				**/
				async__function(function () {
					/**
						* temporary array for word matches for this indivdiual dom node
					**/
					let word_matches = [];
					/**
						* iterate over individual nodes word collection
					**/
					for (let i = 0, words = node.words; i < words.length; i++) {
						/**
							* store the current word (being iterated over from words [collection of words from the node])
						**/
						let word = words[i][1];
						/**
							* attempt to determine if this text has a currency pattern
						**/
						let potential = str__currency(word);
						/**
							* it word has a pattern match
						**/
						if (potential)  {
							/**
								* checking against potential to see if they are the same
								* if they are, it is likely not a currency
							**/
							if (potential !== word) {
						
								let text = { original: word, filtered: potential, starts: words[i][0], ends: words[i][0] + word.length };

								if (words[i - 1]) text.before = words[i - 1][1];

								if (words[i + 1]) text.after = words[i + 1][1];

								word_matches.push({ node: node, text: text });
							}
						}
						
					};
					return word_matches;

				}).then(function (result) {
					/**
						* if async result is a populated array push to the collection of potential currencies array
					**/	
					if (result.length) { 
						possible.push(result);
					}
				
				});

			}).then(function () {
	
				possible = possible.concat.apply([], possible);

				
				let positive = [];
				let grey = [];

				for (let i = 0; i < possible.length; i++) {
					/**
						* attempt to perform a simple match
					**/
					let item = possible[i];

					let text = item.text;
					
					let patterns = ["ISO", "symbol", "symbol_alt", "name"];

					let iso = str__identifier(text, patterns, request.countries);

					if (iso) {
						positive.push({ node: item.node.node, text: text, iso: iso });
					}
					else {
						grey.push(possible[i]);
					}
				};

			});

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