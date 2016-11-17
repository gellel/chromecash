
class ChromeCash {

	static get tags () {
		/** @description: create reference tags for filter **/
		/** @return: is type {array} **/
		return ["STYLE","SCRIPT", "NOSCRIPT", "PRE", "IMG", "CANVAS", "CODE", "ABBR", "TIME", "TEXTAREA", "INPUT", "OPTION", "AUDIO", "SOURCE", "VIDEO", "TRACK", "FORM"];
	}

	static get RegExpWords () {
		/** @description: regular expression for filtering noise from string by splitting at regexp decleration **/
		/** @return: is type {object} **/
		return new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/);
	}

	static XHR (file) {
		/** @description: collects xhr data from resource **/
		/** @param: {file} is type {string} **/
		/** @return: is type {*} **/

		/** set and return promise **/
		return new Promise(function (resolve, reject) {
			/** set xhr object **/
			let xhr = new XMLHttpRequest();
			/** on status change **/
			xhr.onreadystatechange = function () {
				/** confirm request is done **/
				if (xhr.readyState === 4) {
					/** confirm file found **/
					if (xhr.status === 200) {
						/** send resolved **/
						resolve(JSON.parse(xhr.responseText));
					}
					else {
						/** send rejected **/
						reject(xhr);
					};
				}
			};
			/** open xhr request **/
			xhr.open("GET", file, false);
			/** make http request **/
			xhr.send();
		});
	}

	static getCommonCurrencies (callback) {
		/** @description: fetches common currencies json data for use as a lookup for strings to determine what origin they are **/
		/** @param: {callback} is type {function} **/
		/** @return: is type {*} **/

		/** set and return promise **/
		return ChromeCash.XHR(chrome.extension.getURL("json/currency/common.json")).then(function (response) {
			return typeof callback === "function" ? callback(response) : response; 
		});
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
			if (ChromeCash.tags.indexOf(node.parentElement.tagName) === -1) {
				/** confirm that string is not prohibited **/
				if (!regexp.test(node.nodeValue)) {
					/** add to collection **/
					nodes.push(node);
				}
			}
		}
		
		/** return completed array **/
		return nodes;
	}

	static match (text) {
		return potential;
	}

	static index (node) {
		/** @description: splits supplied node with string into words **/
		/** @param: {node} is type {HTML node} **/
		/** @return: is type {array} **/

		/** set base reference to string **/
		let str = node.nodeValue;
		/** set array of split words from string **/
		let strs = str.split(ChromeCash.RegExpWords).filter(function (n) { return /\S/.test(n); });
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
			/** set reference to current string **/
			str = this.match(nodes[i].str)
			/** attempt to match against number **/
			
		};
		return nodes;
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
			/** add filtered object to collection **/
			if (strs.length) collection.push(strs);
		};

		/** return array of filtered objects from dom node walker **/
		return collection;
	}


	static currency (nodes) {

		ChromeCash.getCommonCurrencies(function (file) {

			return setTimeout(function () {
				return ChromeCash.collect(nodes, file.currencies);
			}, 0);

		});

		
	}

}


ChromeCash.currency(ChromeCash.tree(document.body));