
class ChromeCash {

	static get HTML () {
		/** @return: @type: @array{@string}. **/
		return [
			"STYLE",
			"SCRIPT", 
			"NOSCRIPT", 
			"PRE", 
			"IMG", 
			"CANVAS", 
			"CODE", 
			"ABBR", 
			"TIME", 
			"TEXTAREA", 
			"INPUT", 
			"OPTION", 
			"AUDIO", 
			"SOURCE", 
			"VIDEO", 
			"TRACK", 
			"FORM"
		];
	}

	static get REGEX_HEX () {
		/** @return: @type: @regexp. **/
		return new RegExp(/&#x([a-fA-F0-9]+);/);
	}

	static get REGEX_STRS () {
		/** @return: @type: @regexp. **/
		return new RegExp(/[\_\+\-!@#%^&*():;\\\/|<>"'\s\n\t]+/);
	}

	static get REGEX_GRAMMAR () {
		/** @return: @type: @regexp. **/
		return new RegExp(/(?:(\w|\.)*(\.|\,)\w+)/g);
	}

	static get REGEX_CURRENCY () {
		/** @return: @type: @regexp. **/
		return new RegExp(/(?:\d+)(\d+|[,.])+(\d+|\.{1})/g);
	}

	static get CURRENCIES_COMMON () {
		/** @return: @type: @promise. **/
		return ChromeCash.XHR(chrome.extension.getURL("json/currency/common.json"));
	}

	static XHR (file) {
		/** @param: @file, @type: @string. **/

		/** @return: @type: @promise. **/
		return new Promise(function (resolve, reject) {
			/** set new xhr object instance. **/
			let xhr = new XMLHttpRequest();
			/** set on status change event. **/
			xhr.onreadystatechange = function () {
				/** confirm xhr request is done. **/
				if (xhr.readyState === 4) {
					/** confirm xhr status process success. **/
					if (xhr.status === 200) {
						/** promise resolve. **/
						resolve(JSON.parse(xhr.responseText));
					}
					else {
						/** promise reject. **/
						reject(xhr);
					};
				}
			};
			/** open xhr request. **/
			xhr.open("GET", file, true);
			/** make xhr async request. **/
			xhr.send();
		});
	}

	static getCommonCurrencies (callback) {
		/** @param: @callback, @type: @function. **/
		if (!(typeof callback === "function")) return {};

		/** @return @type: @object. **/
		return ChromeCash.CURRENCIES_COMMON.then(function (file) {
			callback(file.currencies); 
		});
	}

	static getIdentifierHex (text) {
		/** @param: @text, @type: @string. **/

		/** @return: @type: @string. **/
		return String.fromCharCode(parseInt(text.replace(ChromeCash.REGEX_HEX, "$1"), 16));
	}

	static matchNumeric (text) {
		/** @param: @text, @type: @string. **/

		/** @return: @type: @string. **/
		return (text.match(ChromeCash.REGEX_GRAMMAR) && text.match(ChromeCash.REGEX_CURRENCY)) ? text : '';
	}

	static matchIdentifier (text, currency) {
		/** @description: checks argument string matches a defined currency formatting identifier. provided from json. **/
		/** @param: {text} is type {string} **/
		/** @param: {curreny} is type {object} **/
		/** @return: @type: @boolean. **/

		/** format symbol. **/
		let hex = ChromeCash.getIdentifierHex(currency.html_hex);
		/* match against symbols. */
		let match = (text.indexOf(hex) > -1 || 
			text.indexOf(currency.ISO) > -1 || 
			text.indexOf(currency.symbol) > -1) ? 
				true : false;

		/** @return: @type: @boolean. **/
		return match;
	}

	static tree (element) {
		/** @description: creates document nodes tree walker for text collection **/
		/** @param: {element} is type {HTML node} **/
		/** @return: is type {array} **/

		/** set dom walker constructor **/
		let tree = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		/** set regexp to test for leading white space in string with zero or more matches **/
		let regexp = new RegExp(/^(?:[\n\s])*$/);
		/** set empty node container **/
		let node = undefined;
		/** set array for containing elements **/
		let nodes = [];

		/** confirm that dom walker contains another item **/
		while (node = tree.nextNode()) {
			/** confirm that this element is not of the prohibited tag types **/
			if (ChromeCash.HTML.indexOf(node.parentElement.tagName) === -1) {
				/** confirm that string is not prohibited **/
				if (!regexp.test(node.nodeValue)) {
					/** add to collection **/
					nodes.push(node);
				}
			}
		}
		
		/** @return: @type: @array{@textNode}. **/
		return nodes;
	}



	static index (node) {
		/** @description: splits supplied node with string into words **/
		/** @param: {node} is type {HTML node} **/
		/** @return: is type {array} **/

		/** set base reference to string **/
		let str = node.nodeValue;
		/** set array of split words from string **/
		let strs = str.split(ChromeCash.REGEX_STRS).filter(function (n) { return /\S/.test(n); });
		/** set default position for where the string was split **/
		let position = 0;

		/** enumerate over array **/
        for (let i = 0, len = strs.length; i < len; i++) {
        	/** set current index of string in words array **/
            let index = str.indexOf(str[i]);
           	/** set position index **/
            position = position + index;
			/** set current array item at position to contain string and its matching counterpart **/
            strs[i] = { i: position, str: strs[i] };
            /** set string slice **/
            str = str.slice(index);
        };

        /** @return: @type: @array{@object:{i:@number,str:@string}}. **/
		return strs;
	}

	static reduce (nodes) {
		/** @description: filters ChromeCash.index returned array to exclude unlikely text strings **/
		/** @param: {nodes} is type {array} **/
		/** @return: is type {array} **/;

		/** set empty array to collect filtered nodes **/
		let collection = [];

		/** enumerate over text collection for sentence **/
		for (let i = 0, len = nodes.length; i < len; i++) {
			/** attempt to match against number **/	
			let str = ChromeCash.matchNumeric(nodes[i].str);
			/** confirm pattern match **/
			if (str) {
				collection.push({
					previousTextNode: (nodes[i - 1] ? nodes[i - 1] : {}),
					textNode: nodes[i],
					nextTextNode: (nodes[i + 1] ? nodes[i + 1] : {})
				});
			}		
		};
		/* @return: @type: {@array}{@object} **/
		return collection;
	}

	static compare (nodes, currencies) {
		/** @description: filters collection array to strip currencies not containing an identifying pattern. **/
		/** @param: {nodes} is type {array} **/

		/** set empty array to collect filtered nodes **/
		let collection = [];

		/** enumerate over text collection for sentence **/
		for (let i = 0, len = nodes.length; i < len; i++) {
			/** iterate over currencies group. **/
			for (let key in currencies) {
				/* set iteration index. */
				let currency = currencies[key];
				/** test currency identifier pattern exists. **/
				if (ChromeCash.matchIdentifier(nodes[i], currency)) {
					/* set strings and currency location. */
					collection.push({ text: nodes[i], currency: currency });
					/* terminate. */
					break;
				}
			}
		};

		/* @return: @type: {@array}{@object} **/
		return collection;
	}


	static collect (nodes) {
		/** @param: @nodes, @type: @array{@textNode}. **/
		/** @description: matches probably currency strings. **/

		/** set array to contain possible matches. **/
		let collection = [];

		/** enumerate for text nodes. **/
		for (let i = 0, len = nodes.length; i < len; i++) {
			/** attempt to find matching pattern. **/
			let strs = ChromeCash.reduce(ChromeCash.index(nodes[i]));
			/** confirm pattern array contains contents. **/
			if (strs.length) 
				/** set collection content for text node at index. **/
				collection.push({ 
					strings: strs, node: nodes[i], parent: nodes[i].parentElement });
		};
		/** @return: @type: @array{@object}. **/
		return collection;
	}


	static currency (nodes) {
		/** @param: @nodes, @type: @array{@textNode}. **/

		let collection = ChromeCash.collect(nodes);

		/** @return: @type: @array{@object}. **/
		return ChromeCash.getCommonCurrencies(function (currencies) {
			/** enumerate for collection array. **/
			for (let i = 0, len = collection.length; i < len; i++) {
				/** set reference to item at index. **/
				let c = collection[i];

				/** enumerate for strings in collection item. **/
				for (let j = 0, strlen = c.strings.length; j < strlen; j++) {

					console.log(c.strings[j])
				}
			}
		});
	}

	static highlight (collection) {
		/** c[i].parent.insertBefore(document.createElement('chrome-cash').insertNode('div', function (d) {
					return d.parentElement;
				}), c[i].node.nextSibling) **/
	}

}



document.body.insertNode('Chrome-Cash', {style:"position:fixed;top:0;right:0;width:40px;height:40px;background:aqua;z-index:10000"}, function (d) {
	d.addEventListener('click', function () {
		ChromeCash.currency(ChromeCash.tree(document.body));
	}, false);
});
//console.log(ChromeCash.currency(ChromeCash.tree(document.body)));