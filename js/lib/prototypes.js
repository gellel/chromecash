(function(win, el, node, collection) {
    "use strict";

    el.prototype.setMultipleAttributes = function (attributes) {
        for (var key in attributes) {
            this.setAttribute(key, attributes[key]);
        };
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
    };

    String.prototype.splitIndex = function (regExp) {
        var __self__ = this;

        var words = __self__.split(regExp).filter(function (n) { return /\S/.test(n); })

        var position = 0;

        for (var i = 0; i < words.length; i++) {
            var index = __self__.indexOf(words[i]);

            words[i] = [position = (position + index), words[i]];

            __self__ = __self__.slice(index);
        }

        return words;
        
    };

}(window, Element, NodeList, HTMLCollection));