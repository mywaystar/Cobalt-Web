Cobalt.utils.protoype = function() {
  var self = this;

  var Utils = {
    $: function(selector) {
      if (typeof selector === "string") {
        if (selector[0] == "#") {
          return document.getElementById(selector.replace('#', ''));
        } else {
          return document.querySelectorAll(selector);
        }
      } else {
        return selector;
      }
    },
    toString: Object.prototype.toString,
    logToString: function(stuff) {
      switch (typeof stuff) {
        case "string":
          break;
        case "function":
          stuff = ("" + stuff.call).replace('native', 'web'); //to avoid panic ;)
          break;
        default:
          try {
            stuff = JSON.stringify(stuff);
          } catch (e) {
            stuff = "" + stuff;
          }
      }
      return stuff;
    },

    class2type: {},
    attr: function(node, attr, value) {
      node = Utils.$(node);
      if (value) {
        if (node && node.setAttribute) {
          node.setAttribute(attr, value);
        }
      } else {
        return (node && node.getAttribute) ? node.getAttribute(attr) : undefined;
      }
    },
    text: function(node, text) {
      node = Utils.$(node);
      if (typeof node == "object") {
        if (text) {
          node.innerText = text;
        } else {
          return node.innerText;
        }
      }
    },
    html: function(node, html) {
      node = Utils.$(node);
      if (typeof node == "object") {
        if (html !== undefined) {
          node.innerHTML = html;
        } else {
          return node.innerHTML;
        }
      }
    },
    HTMLEncode: function(value) {
      var element = document.createElement('div');
      Utils.text(element, value || '');
      return Utils.html(element);
    },
    HTMLDecode: function(value) {
      var element = document.createElement('div');
      Utils.html(element, value || '');
      return Utils.text(element);
    },
    likeArray: function(obj) {
      return typeof obj.length == 'number';
    },
    each: function(elements, callback) {
      var i, key;
      if (Utils.likeArray(elements)) {
        for (i = 0; i < elements.length; i++)
          if (callback.call(elements[i], i, elements[i]) === false) return;
      } else {
        for (key in elements)
          if (callback.call(elements[key], key, elements[key]) === false) return;
      }
    },
    extend: function(obj, source) {
      if (!obj) obj = {};
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
      return obj;
    },
    append: function(node, html) {
      node = Utils.$(node);
      if (typeof node == "object") {
        node.innerHTML = node.innerHTML + html;
      }
    },
    css: function(node, obj) {
      node = Utils.$(node);
      if (typeof node === "object" && node.style) {
        if (typeof obj == "object") {
          for (var prop in obj) {
            node.style[prop] = (typeof obj[prop] == "string") ? obj[prop] : obj[prop] + "px";
          }
        } else {
          var style = window.getComputedStyle(node);
          if (style) {
            return style[obj] ? style[obj].replace('px', '') : undefined;
          }
        }
      }
    },
    addClass: function(node, css_class) {
      node = Utils.$(node);
      if (typeof node == "object" && css_class) {
        if (node.classList) {
          node.classList.add(css_class);
        } else {
          node.setAttribute("class", node.getAttribute("class") + " " + css_class);
        }
      }
    },
    removeClass: function(node, css_class) {
      node = Utils.$(node);
      if (typeof node == "object" && css_class) {
        if (node.classList) {
          node.classList.remove(css_class);
        } else {
          node.setAttribute("class", node.getAttribute("class").replace(css_class, ''));
        }
      }
    },
    escape: encodeURIComponent,
    serialize: function(params, obj, traditional, scope) {
      var type, array = Utils.isArray(obj),
        hash = Utils.isPlainObject(obj);
      Utils.each(obj, function(key, value) {
        type = Utils.type(value);
        if (scope) key = traditional ? scope :
          scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
        // handle data in serializeArray() format
        if (!scope && array) params.add(value.name, value.value);
        // recurse into nested objects
        else if (type == "array" || (!traditional && type == "object"))
          Utils.serialize(params, value, traditional, key);
        else params.add(key, value);
      });
    },
    param: function(obj, traditional) {
      var params = [];
      params.add = function(k, v) {
        this.push(Utils.escape(k) + '=' + Utils.escape(v));
      };
      Utils.serialize(params, obj, traditional);
      return params.join('&').replace(/%20/g, '+');
    },
    isArray: function(obj) {
      if (!Array.isArray) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      } else {
        return Array.isArray(obj);
      }
    },
    isNumber: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isWindow: function(obj) {
      return obj !== null && obj == obj.window;
    },
    isObject: function(obj) {
      return this.type(obj) == "object";
    },
    isPlainObject: function(obj) {
      return this.isObject(obj) && !this.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    },
    type: function(obj) {
      return obj === null ?
        String(obj) :
        this.class2type[Utils.toString.call(obj)] || "object";
    },
    init: function() {
      this.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        Utils.class2type["[object " + name + "]"] = name.toLowerCase();
      });
    }
  };


  Utils.init();

  return Utils;
};
