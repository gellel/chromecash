class Passage  {

	/***
	 *** Passage manages textNodes from document.createTreeWalker.
	 *
	 *
	 * Consumes content from document text node.
	 * Separates substrings by defined regular expression.
	 * Extends Passage child class.
	 *
	 */

	constructor (textNode) {
		/* @param: {textNode}, @type: {document.textNode}. */

		/* set class immutable properties. */
		Object.defineProperties(this, {
			textNode: {
				/* document text node object. */
				enumerable: true,
				writable: false,
				configurable: false,
				value: textNode
			},
			textNodeValue: {
				/* string contents from text node. */
				enumerable: true,
				writable: false,
				configurable: false,
				value: textNode.nodeValue
			},
			textNodeLength: {
				/* length of content from text node. */
				enumerable: true,
				writable: false,
				configurable: false,
				value: textNode.nodeValue.length
			},
			textNodeMatches: {
				/* substring separator. */
				enumerable: true,
				writable: false,
				configurable: false,
				value: textNode.nodeValue.match(
					new RegExp(/[^\~\`\!\@\#\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\>\?\/\s\n\t]+/g))
			}
		});
	}
};