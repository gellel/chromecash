class S {

	static get REG_EX_STR_HEX () {
		/***
		 *** Match pattern representing HTML hexidecimal string.
		 *
		 * Pattern tests against hexidecimal string.
		 * Expression does not match against colour representation.
		 *
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/&#x([a-fA-F0-9]+);/);
	}

	static get REG_EX_STR_MONEY_ISO () {
		/***
		 *** Match string pattern potentially containing ISO.
		 *
		 * Pattern matches strings punctuated by periods and commas.
		 * Expression captures more noise than REG_EX_STR_MONEY_SUM.
		 * Pattern does not exclude identifiers.
		 *
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/(?:(\w|\.)*(\.|\,)\w+)/g);
	}

	static get REG_EX_STR_MONEY_SUM () {
		/***
		 *** Match string patterns representing currency.
		 *
		 * Pattern supports European and American representations.
		 * Expression allows learing zero sums and period first sums.
		 *
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/(?:\d*)(\d*|[,.])+(\d+|\.{1}\d+)/g);
	}

	static get REG_EX_STR_FILTER () {
		/***
		 *** Match strings not used for financial representation.
		 *
		 * Pattern matches against most cases. Produces sizable sequences.
		 * Expression groups most alphanumeric. 
		 * Captures allowed special characters in groups.
		 * 
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/[^\~\`\!\@\#\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\>\?\/\s\n\t]+/g);
	}

	get substrings () {
		return this.node.nodeValue.match(this.constructor.REG_EX_STR_FILTER);
	}

	get indexes () {
		return this.substrings.map((string, i, substrings)=>{

			let caption = this.node.nodeValue;


			let start = caption.indexOf(string);

			let end = start + string.length;

			let size = caption.length;

			let representative = i;

			let constituents = substrings.length

			return { string, start, end, size, representative, constituents }
		});
	}

	constructor (node) {
		this.node = node instanceof Text ? 
			node : document.createTextNode(node.toString());
	}
}


var z = new S("LOL 1313,4242240.00 242421 MIE");

clear();