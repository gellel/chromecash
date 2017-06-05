class Cite {

	constructor (textValue, index, textNodeSubstrings, textNodeValue) {
		/** @param: @textValue, @type: document.textElement. **/
		/** @param: @index: @type: @number. **/
		/** @param: @textNodeSubstrings, @type: @array. **/
		/** @param: @textNodeValue, @type: document.textElement. **/
		
		Object.defineProperties(this, {
			textValue: {
				enumerable: true,
				writable: false,
				value: textValue
			},
			textValueLength: {
				enumerable: true,
				writable: false,
				value: textValue.length
			},
			textStartAt: {
				enumerable: true,
				writable: false,
				value: textNodeValue.indexOf(textValue)
			},
			textEndAt: {
				enumerable: true,
				writable: false,
				value: (textNodeValue.indexOf(textValue) + textValue.length)
			},
			textValueConsumes: {
				enumerable: true,
				writable: false,
				value: (textNodeValue.length - (textNodeValue.indexOf(textValue) + textValue.length))
			},
			textNodeSubstringPosition: {
				enumerable: true,
				writable: false,
				value: index
			},
			textNodeSubstringSize: {
				enumerable: true,
				writable: false,
				value: textNodeSubstrings.length
			},
			textNodeValue: {
				enumerable: true,
				writable: false,
				value: textNodeValue
			},
			textNodeValueLength: {
				enumerable: true,
				writable: false,
				value: textNodeValue.length
			}
		});
	}
};