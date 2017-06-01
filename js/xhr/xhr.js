class XHR {
	
	static GET (URL) {
		/** @param: @URL, @type: @string. **/
		
		/** set promise constructor. **/
		let promise = new Promise(function (resolve, reject) {
			/** set xhr constructor. **/
			let xhr = new XMLHttpRequest();
			/** set xhr status handler. **/
			xhr.onreadystatechange = function () {
				if (this.readyState === 4) 
					this.status === 200 ? resolve(xhr) : reject(xhr);
			};
			/** set xhr endpoint. **/
			xhr.open("GET", URL, true);
			/** send xhr request. **/
			xhr.send();
		});	

		/** @return: @type: @promise. **/
		return promise;
	}
}