class RE {

	static get REG_EX_HEXIDECIMAL () {
		/***
		 *** Match pattern representing HTML hexidecimal string.
		 *
		 * Pattern tests against hexidecimal string.
		 * Expression not valid against colour representation.
		 *
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/&#x([a-fA-F0-9]+);/);
	}

	static get REG_EX_STR_ISO () {
		/***
		 *** Match string pattern potentially containing ISO.
		 *
		 * Pattern matches strings punctuated by periods and commas.
		 * Expression captures more noise than REG_EX_STR_MONEY.
		 * Pattern does not exclude identifiers.
		 *
		 */

		/* @return: @type: @regexp. */
		return new RegExp(/(?:(\w|\.)*(\.|\,)\w+)/g);
	}

	static get REG_EX_STR_MONEY () {
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
		return new RegExp(/[\~\`\!\@\#\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\>\?\/\s\n\t]+/g);
	}
}