class Re {

	/***
	 *** Regular Expression manager.
	 *
	 * Contains pattern constants for ChromeCash.
	 * Available as a extensible parent.
	 *
	 */

	static get HEX () {
		/***
		 *** Substrings containing UTF hex.
		 *
		 * Pattern consumes strings representing encoded symbols.
		 *
		 */

		/* @return @type @regexp */
		return new RegExp(/&#x([a-fA-F0-9]+);/);
	}

	static get FORMATTED () {
		/***
		 *** Substrings containing punctuation and alphanumeric.
		 *
		 * Pattern consumes strings punctuated by periods and commas.
		 * Expression captures more noise than RE.MONEY.
		 * Substrings intented to resemble currency coded strings.
		 *
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/(?:(\w|\.)*(\.|\,)\w+)/g);
	}

	static get MONEY () {
		/***
		 *** Substrings containing currency expressions.
		 *
		 * Pattern supports European and American representations.
		 * Expression allows learing zero sums and period first sums.
		 *
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/(?:\d*)(\d*|[,.])+(\d+|\.{1}\d+)/g);
	}

	static get FILTER () {
		/***
		 *** Substrings matching against exclusionary group.
		 *
		 * Pattern matches against most cases. Produces sizable sequences.
		 * Expression groups most alphanumeric. 
		 * Captures allowed special characters in groups.
		 * 
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/[^\~\`\!\@\#\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\>\?\/\s\n\t]+/g);
	}
}