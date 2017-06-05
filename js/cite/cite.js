class Cite {

	/***
	 *** Cite class manages substring metadata.
	 *
	 *
	 * Consumes content from document text node.
	 * Separates substring data into segmented attributes.
	 * Currencies class integrates subclass during text nodes matches operation.
	 * Engineered as immutable object constructor.
	 *
	 */

	constructor (textValue, index, textNodeSubstrings, textNodeValue) {
		/* set class immutable properties. */
		Object.defineProperties(this, {
			textValue: {
				/* contains base substring from textNodeValue. */
				enumerable: true,
				writable: false,
				value: textValue
			},
			textValueLength: {
				/* substring text size. */
				enumerable: true,
				writable: false,
				value: textValue.length
			},
			textStartAt: {
				/* substring starting index in textNodeValue. */
				enumerable: true,
				writable: false,
				value: textNodeValue.indexOf(textValue)
			},
			textEndAt: {
				/* substring ending index in textNodeValue. */
				enumerable: true,
				writable: false,
				value: (textNodeValue.indexOf(textValue) + textValue.length)
			},
			textValueConsumes: {
				/* percentage characters of substring compose main string. */
				enumerable: true,
				writable: false,
				value: ((textValue.length / textNodeValue.length) * 100)
			},
			textNodeSubstringPosition: {
				/* position of substring in split substring array. */
				enumerable: true,
				writable: false,
				value: index
			},
			textNodeSubstringSize: {
				/* number of substrings for textNodeValue. */
				enumerable: true,
				writable: false,
				value: textNodeSubstrings.length
			},
			textNodeValue: {
				/* main string from which substrings were derrived. */
				enumerable: true,
				writable: false,
				value: textNodeValue
			},
			textNodeValueLength: {
				/* size of main text string. */
				enumerable: true,
				writable: false,
				value: textNodeValue.length
			}
		});
	}
};