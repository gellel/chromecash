class Segment extends Passage {

	/***
	 *** Segment inherits Passage constructor.
	 *
	 * Maps substring matches to cite classes.
	 *
	 */

	constructor (textNode) {
		/* @param: {textNode}, @type: {document.textNode}. */

		/* extend parent class properties. */
		Object.defineProperties(super(textNode), {
			textNodeCitations: {
				/* construct cite classes from substrings. */
				enumerable: true,
				writable: false,
				configurable: false,
				value: this.textNodeMatches.map(function (textValue, index, textNodeSubstrings) {
					/* construct new instance of cite class. */
					return new Cite(textValue, index, textNodeSubstrings, textNode.nodeValue); }.bind(this))
			}
		});
	}
};
