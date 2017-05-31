
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

	static XHR (filePath) {
		/** @param: @filePath, @type: @string. **/

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
			/** open xhr request **/
			xhr.open("GET", filePath, true);
			/** make xhr async request **/
			xhr.send();
		});
	}

	static getCommonCurrencies (callback) {
		/** @param: @callback, @type: @function. **/
		if (!(typeof callback === "function")) return {};

		/** @return @type: @object. **/
		return ChromeCash.CURRENCIES_COMMON.then(callback);
	}


	static getCurrenciesHexCharacter (text) {
		/** @param: @text, @type: @string. **/

		/** @return: @type: @string. **/
		return String.fromCharCode(parseInt(text.replace(ChromeCash.REGEX_HEX, "$1"), 16));
	}

	static matchCurrencyNumeric (text) {
		/** @description: checks argument string matches universal currency formatting pattern. **/
		/** @param: {text} is type {string} **/
		/** @return: @type: @string. **/
		return (text.match(ChromeCash.REGEX_GRAMMAR) 
			&& text.match(ChromeCash.REGEX_CURRENCY)) ? text : '';
	}

	static matchCurrencyIdentifier (text, currency) {
		/** @description: checks argument string matches a defined currency formatting identifier. provided from json. **/
		/** @param: {text} is type {string} **/
		/** @param: {curreny} is type {object} **/
		/** @return: @type: @boolean. **/

		/** format symbol. **/
		let hex = ChromeCash.getCurrenciesHexCharacter(currency.html_hex);
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

        /** return string index array **/
		return strs;
	}

	static reduce (nodes, currencies) {
		/** @description: filters ChromeCash.index returned array to exclude unlikely text strings **/
		/** @param: {nodes} is type {array} **/
		/** @param: {currencies} is type {array} **/
		/** @return: is type {array} **/;

		/** set empty array to collect filtered nodes **/
		let collection = [];

		/** enumerate over text collection for sentence **/
		for (let i = 0, len = nodes.length; i < len; i++) {
			/** attempt to match against number **/	
			let str = ChromeCash.matchCurrencyNumeric(nodes[i].str);
			/** confirm pattern match **/
			if (str) collection.push(str);		
		};

		/* @return: @type: {@array}{@string} **/
		return collection;
	}

	static compare (nodes, currencies) {
		/** @description: filters collection array to strip currencies not containing an identifying pattern. **/
		/** @param: {nodes} is type {array} **/

		/** set empty array to collect filtered nodes **/
		let collection = [];

		/** enumerate over text collection for sentence **/
		for (let i = 0, len = nodes.length; i < len; i++) {
			/** iterate over curriences group. **/
			for (let key in currencies) {
				/* set iteration index. */
				let currency = currencies[key];
				/** test currency identifier pattern exists. **/
				if (ChromeCash.matchCurrencyIdentifier(nodes[i], currency)) {
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


	static collect (nodes, currencies) {
		/** @description: confirms nodes are currency **/
		/** @param: {nodes} is type {array} **/
		/** @param: {currencies} is type {array} **/
		/** @return: is type {array} **/

		/** set empty array to collect nodes **/
		let collection = [];

		/** enumerate over supplied html elements **/
		for (let i = 0, len = nodes.length; i < len; i++) {
			/** set filtered object **/
			let strs = ChromeCash.reduce(ChromeCash.index(nodes[i]), currencies);
			/** set tested currencies. **/
			let tests = ChromeCash.compare(strs, currencies);
			/** add filtered object to collection **/
			if (tests.length) {
				console.log(tests)
				/*collection.push({
					strings: tests, 
					textNodeElement: nodes[i], 
					parentElement: nodes[i].parentElement, 
					currencies: currencies 
				});*/
			}
		};

		/** return array of filtered objects from dom node walker **/
		return collection;
	}


	static currency (nodes) {
		/** @param: {nodes}, @type: {array}<{TextNodeObject}> **/
		/** @return: @type: @promise. **/
		return ChromeCash.getCommonCurrencies(function (file) {
			/** @return: @type: @array<object>. **/
			return ChromeCash.collect(nodes, file.currencies);
		});
	}

	static highlight (nodes) {
		/** @param: {nodes}, @type: {array}{TextNodeObject} **/

		ChromeCash.currency(nodes).then(function (collection) {
			/** iterate for currencies collection. **/
			for (let i = 0; i < collection.length; i++) {
				/** set collection item at index. **/
				let c = collection[i];
				
				for (let j = 0; j < c.strings.length; j++) {

					console.log(c.strings[j]);
				}

				console.log('\n');

				/*c[i].parentElement.insertBefore(document.createElement('chrome-cash').insertNode('div', function (d) {
					return d.parentElement;
				}), c[i].textNodeElement.nextSibling);*/
			}
		});
	}

}



ChromeCash.highlight(ChromeCash.tree(document.body));

//console.log(ChromeCash.currency(ChromeCash.tree(document.body)));