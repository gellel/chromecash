
class ChromeCash {


	static get tags () {
		/** @description: create reference tags for filter **/
		/** @return: is type {array} **/
		return ["STYLE","SCRIPT", "NOSCRIPT", "PRE", "IMG", "CANVAS", "CODE", "ABBR", "TIME", "TEXTAREA", "INPUT", "OPTION", "AUDIO", "SOURCE", "VIDEO", "TRACK", "FORM"]
	}

	static get RegExpWords () {
		/** @description: regular expression for filtering noise from string **/
		/** @return: is type {object} **/
		return new RegExp(/\s|[\_\+\-!@#%^&*():;\\\/|<>"'\n\t]+/);
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

	static index (node) {

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
            strs[i] = [position, strs[i]];
            /** set string slice **/
            str = str.slice(index);
        }

        /** return string index array **/
		return strs;
	}

	static currency (nodes) {
		/** @description: confirms nodes are currency **/
		/** @param: {nodes} is type {array} **/
		/** @return: is type {array} **/
		for (let i = 0, len = nodes.length; i < len; i++) {
			console.log(ChromeCash.index(nodes[i]));
		}
	}
}


ChromeCash.currency(ChromeCash.tree(document.body))