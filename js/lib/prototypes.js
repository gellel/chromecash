(function(win, el, node, collection) {
    "use strict";

    el.prototype.hasClass = function (cls) {
        return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(this.className);
    };

    el.prototype.addClass = function (cls) {
        if (!this.hasClass(cls)) {
            this.className = this.className + ' ' + cls;
        }
    };

    el.prototype.removeClass = function (cls) {
        if (this.hasClass(cls)) {
            var reg = new RegExp('(\\s|^)'+ cls +'(\\s|$)');
            this.className = this.className.replace(reg,' ');
        }
    }

    el.prototype.setMultipleAttributes = function (attributes) {
        for (var key in attributes) {
            this.setAttribute(key, attributes[key]);
        };
    };

    el.prototype.observe = function (observables, callback) {
        for (var i = 0; i < observables.length; i++) {
            this[observables[i].name](observables[i].data);
        }
    };

    el.prototype.bind = function (event, callback, propegation) {
        this.attachEvent ? this.attachEvent("on" + event, callback) : this.addEventListener(event, callback, propegation);
    };

    el.prototype.unbind = function (event, funct) {
        this.detachEvent ? this.detachEvent(event, funct) : this.removeEventListener(event, funct);
        if (funct) funct();
    }

    el.prototype.remove = function () {
        this.parentElement.removeChild(this);
    };

    el.prototype.insertNode = function () {
        var parameters = Array.prototype.slice.call(arguments);
        var container = this.appendChild(document.createElement(parameters.shift()));

        for (var i in parameters) {
            switch (typeof parameters[i]) {
                case "string":
                    container.appendChild(document.createTextNode(parameters[i]));
                    break;
                case "object":
                    container.setMultipleAttributes(parameters[i]);
                    break;
            };
        };
        if (typeof parameters.slice(-1)[0] === "function") parameters.slice(-1)[0](container, parameters);

        return container;
    };

    el.prototype.insertTextNode = function () {
        var parameters = Array.prototype.slice.call(arguments);

        this.appendChild(document.createTextNode(parameters[0]));
        if (typeof parameters[1] === "function") parameters[1](this);
    };

    el.prototype.removeTextNode = function () {
        var parameters = Array.prototype.slice.call(arguments);
        this.childNodes[0].remove();
        if (typeof parameters.slice(-1)[0] === "function") parameters.slice(-1)[0](this);
    };

    node.prototype.remove = collection.prototype.remove = function() {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        };
    };

    win.bind = function (event, callback, propegation) {
        this.attachEvent ? this.attachEvent("on" + event, callback) : this.addEventListener(event, callback, propegation);
    };

    win.unbind = function (event, funct) {
        this.detachEvent ? this.detachEvent(event, funct) : this.removeEventListener(event, funct);
        if (funct) funct();
    }

    win.ajax = {};
    win.ajax.x = function() {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        var versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];

        var xhr;
        for (var i = 0; i < versions.length; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (xhrError) {}
        };
        return xhr;
    };

    win.ajax.send = function (url, callback, method, data, sync) {
        var x = win.ajax.x();
        x.open(method, url, sync);
        x.onreadystatechange = function() {
            if (x.readyState === 4) {
                callback(x.responseText);
            }
        };
        if (method === 'POST') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        if (method === 'GET') {
            x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        x.send(data);
    };

    win.ajax.get = function (url, data, callback, sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        console.log(url + (query.length ? '?' + query.join('&') : ''))
        win.ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, sync);
    };

    win.ajax.post = function (url, data, callback, sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        win.ajax.send(url, callback, 'POST', query.join('&'), sync);
    };

    win.jsonp = {};
    win.jsonp.get = function (url, callback) {
        var queryconcat = (url.indexOf('?')) ? "&" : "?";
         
        win.jsonp.response = callback;
        document.body.insertNode("script", {
            id: "json",
            "type": "text/javascript",
            "src": url + queryconcat + "callback=window.jsonp.response"
        });
    };

    win.jsonf = {};
    win.jsonf.get = function (id, url, callback) {
        var queryconcat = (url.indexOf('?')) ? "&" : "?";
        win.jsonf["json_" + id] = function(response) {
            callback(response, id);
            delete win.jsonf["json_" + id];
        };
        document.body.insertNode("script", {
            "id": "json" + id,
            "type": "text/javascript",
            "src": url + queryconcat + "callback=window.jsonf.json_" + id + ""
        });
    };

    win.getScript = function (source, callback) {
        var script = document.createElement('script');
        var prior = document.getElementsByTagName('script')[0];
        script.async = 1;
        prior.parentNode.insertBefore(script, prior);

        script.onload = script.onreadystatechange = function(_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                if (!isAbort) {
                    if (callback) {
                        callback();
                    }
                }
            }
        };
        script.src = source;
    };

    win.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

}(window, Element, NodeList, HTMLCollection));