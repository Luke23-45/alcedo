/**
 * Hermes (React Native) DOM & Document Stub Polyfill
 *
 * Hermes has no browser DOM globals. Universal libraries (such as `styled-components`,
 * `styled-components/native`, `@tolgee/web`, `@apollo/client`, MSW, etc.) evaluate browser
 * globals (`document`, `window`, `HTMLElement`, `Node`, `MutationObserver`) during bundle
 * evaluation or when imported.
 *
 * This file is injected via `config.serializer.getPolyfills()` in `metro.config.js`
 * so it executes BEFORE the main bundle and before `InitializeCore.js`.
 * Keep it strictly side-effect only and CommonJS/script compatible (no imports/exports).
 */
/* eslint-disable no-undef, @typescript-eslint/no-explicit-any, no-var */
(function () {
  'use strict';

  // 1. Resolve root global object across Hermes, JSC, V8, Node
  var root =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof global !== 'undefined' && global) ||
    (typeof window !== 'undefined' && window) ||
    (typeof self !== 'undefined' && self) ||
    (function () { return this; })() ||
    {};

  function safeSet(obj, key, value) {
    if (!obj) return;
    try {
      obj[key] = value;
    } catch (_) {
      try {
        Object.defineProperty(obj, key, {
          value: value,
          writable: true,
          configurable: true,
          enumerable: false,
        });
      } catch (__) { }
    }
  }

  // 2. Establish global aliases early
  if (typeof root.window === 'undefined') safeSet(root, 'window', root);
  if (typeof root.global === 'undefined') safeSet(root, 'global', root);
  if (typeof root.self === 'undefined') safeSet(root, 'self', root);
  if (typeof root.globalThis === 'undefined') safeSet(root, 'globalThis', root);

  var win = root.window || root;

  // 3. Mock CSSStyleDeclaration (supports both direct properties and methods)
  function createCSSStyleDeclaration() {
    var style = {};
    safeSet(style, 'setProperty', function (prop, val) {
      style[String(prop)] = String(val);
    });
    safeSet(style, 'getPropertyValue', function (prop) {
      var v = style[String(prop)];
      return v != null ? String(v) : '';
    });
    safeSet(style, 'removeProperty', function (prop) {
      var v = style[String(prop)] || '';
      delete style[String(prop)];
      return v;
    });
    return style;
  }

  // 4. Lightweight Event Target implementation
  function makeEventTarget(target) {
    var listeners = {};
    target.addEventListener = function (type, callback) {
      if (!type || typeof callback !== 'function') return;
      listeners[type] = listeners[type] || [];
      if (listeners[type].indexOf(callback) === -1) {
        listeners[type].push(callback);
      }
    };
    target.removeEventListener = function (type, callback) {
      if (!type || !listeners[type]) return;
      var idx = listeners[type].indexOf(callback);
      if (idx !== -1) {
        listeners[type].splice(idx, 1);
      }
    };
    target.dispatchEvent = function (event) {
      if (!event || !event.type) return true;
      var type = event.type;
      if (!listeners[type] || listeners[type].length === 0) return true;
      var ev = event;
      if (typeof ev === 'string') ev = { type: ev };
      try {
        ev.target = target;
        ev.currentTarget = target;
      } catch (_) { }
      var list = listeners[type].slice();
      for (var i = 0; i < list.length; i++) {
        try {
          list[i].call(target, ev);
        } catch (err) { }
      }
      return !ev.defaultPrevented;
    };
    return target;
  }

  // 5. DOM Prototype & Constructor Hierarchy (Required for `instanceof` checks)
  function Node() { }
  Node.ELEMENT_NODE = 1;
  Node.ATTRIBUTE_NODE = 2;
  Node.TEXT_NODE = 3;
  Node.COMMENT_NODE = 8;
  Node.DOCUMENT_NODE = 9;
  Node.DOCUMENT_FRAGMENT_NODE = 11;
  Node.prototype.nodeType = 1;

  function Element() { }
  Element.prototype = Object.create(Node.prototype);
  Element.prototype.constructor = Element;

  function HTMLElement() { }
  HTMLElement.prototype = Object.create(Element.prototype);
  HTMLElement.prototype.constructor = HTMLElement;

  function HTMLStyleElement() { }
  HTMLStyleElement.prototype = Object.create(HTMLElement.prototype);
  HTMLStyleElement.prototype.constructor = HTMLStyleElement;

  function HTMLHeadElement() { }
  HTMLHeadElement.prototype = Object.create(HTMLElement.prototype);
  HTMLHeadElement.prototype.constructor = HTMLHeadElement;

  function HTMLBodyElement() { }
  HTMLBodyElement.prototype = Object.create(HTMLElement.prototype);
  HTMLBodyElement.prototype.constructor = HTMLBodyElement;

  function HTMLHtmlElement() { }
  HTMLHtmlElement.prototype = Object.create(HTMLElement.prototype);
  HTMLHtmlElement.prototype.constructor = HTMLHtmlElement;

  function Document() { }
  Document.prototype = Object.create(Node.prototype);
  Document.prototype.constructor = Document;
  Document.prototype.nodeType = 9;

  function HTMLDocument() { }
  HTMLDocument.prototype = Object.create(Document.prototype);
  HTMLDocument.prototype.constructor = HTMLDocument;

  function DocumentFragment() { }
  DocumentFragment.prototype = Object.create(Node.prototype);
  DocumentFragment.prototype.constructor = DocumentFragment;
  DocumentFragment.prototype.nodeType = 11;

  function Text(text) {
    this.textContent = String(text != null ? text : '');
    this.data = this.textContent;
  }
  Text.prototype = Object.create(Node.prototype);
  Text.prototype.constructor = Text;
  Text.prototype.nodeType = 3;
  Text.prototype.nodeName = '#text';

  function Comment(text) {
    this.textContent = String(text != null ? text : '');
    this.data = this.textContent;
  }
  Comment.prototype = Object.create(Node.prototype);
  Comment.prototype.constructor = Comment;
  Comment.prototype.nodeType = 8;
  Comment.prototype.nodeName = '#comment';

  function CSSStyleSheet() { }
  CSSStyleSheet.prototype.constructor = CSSStyleSheet;

  // 6. Mock StyleSheet for styled-components CSSOM injection
  function createStyleSheet(ownerNode) {
    var cssRules = [];
    var sheet = Object.create(CSSStyleSheet.prototype);
    sheet.ownerNode = ownerNode;
    sheet.cssRules = cssRules;
    sheet.rules = cssRules;
    sheet.disabled = false;
    sheet.href = null;
    sheet.media = { mediaText: '' };
    sheet.title = null;
    sheet.type = 'text/css';

    // Must return the integer index of the inserted rule
    sheet.insertRule = function (rule, index) {
      var r = String(rule || '');
      var idx =
        typeof index === 'number' && index >= 0 && index <= cssRules.length
          ? index
          : cssRules.length;
      var selectorMatch = r.match(/^([^{]+)\{/);
      var ruleObj = {
        cssText: r,
        selectorText: selectorMatch ? selectorMatch[1].trim() : '',
        style: createCSSStyleDeclaration(),
      };
      cssRules.splice(idx, 0, ruleObj);
      return idx;
    };

    sheet.deleteRule = function (index) {
      var idx = typeof index === 'number' ? index : 0;
      if (idx >= 0 && idx < cssRules.length) {
        cssRules.splice(idx, 1);
      }
    };

    return sheet;
  }

  // 7. Minimal CSS selector matcher (handles tags, classes, IDs, and [data-styled] attributes)
  function matchesSelector(el, sel) {
    if (!el || el.nodeType !== 1) return false;
    sel = String(sel || '').trim();
    if (!sel || sel === '*') return true;

    var attrMatch = sel.match(/^([a-zA-Z0-9_-]*)\[([a-zA-Z0-9_-]+)(?:([~|^$*]?=)["']?([^"']*)["']?)?\]$/);
    if (attrMatch) {
      var tag = attrMatch[1];
      var attr = attrMatch[2];
      var op = attrMatch[3];
      var val = attrMatch[4];
      if (tag && el.tagName.toLowerCase() !== tag.toLowerCase()) return false;
      if (!el.hasAttribute(attr)) return false;
      if (!op) return true;
      var actualVal = el.getAttribute(attr) || '';
      if (op === '=') return actualVal === val;
      if (op === '*=') return actualVal.indexOf(val) >= 0;
      if (op === '^=') return actualVal.indexOf(val) === 0;
      if (op === '$=') return actualVal.slice(-val.length) === val;
      return true;
    }

    if (sel.charAt(0) === '.') {
      return el.classList && el.classList.contains(sel.slice(1));
    }
    if (sel.charAt(0) === '#') {
      return el.id === sel.slice(1);
    }
    return el.tagName.toLowerCase() === sel.toLowerCase();
  }

  function queryElement(parent, sel, returnAll) {
    var results = [];
    function walk(node) {
      if (!node || !node.childNodes) return;
      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType === 1) {
          if (matchesSelector(child, sel)) {
            results.push(child);
            if (!returnAll) return true;
          }
          if (walk(child) && !returnAll) return true;
        }
      }
      return false;
    }
    walk(parent);
    return returnAll ? results : results[0] || null;
  }

  // 8. Robust Element Factory
  function createMockElement(tagName, ownerDoc) {
    var tag = String(tagName || 'div').toUpperCase();
    var proto = HTMLElement.prototype;
    if (tag === 'STYLE') proto = HTMLStyleElement.prototype;
    else if (tag === 'HEAD') proto = HTMLHeadElement.prototype;
    else if (tag === 'BODY') proto = HTMLBodyElement.prototype;
    else if (tag === 'HTML') proto = HTMLHtmlElement.prototype;

    var el = Object.create(proto);
    var childNodes = [];
    var attributes = {};

    el.nodeType = 1;
    el.nodeName = tag;
    el.tagName = tag;
    el.ownerDocument = ownerDoc;
    el.parentNode = null;
    el.parentElement = null;
    el.childNodes = childNodes;
    el.children = childNodes;
    el.style = createCSSStyleDeclaration();
    el.textContent = '';
    el.innerHTML = '';
    el.outerHTML = '';
    el.dataset = {};
    el.id = '';
    el.className = '';

    el.setAttribute = function (name, val) {
      var n = String(name).toLowerCase();
      var strVal = String(val);
      attributes[n] = strVal;
      if (n === 'id') el.id = strVal;
      if (n === 'class') el.className = strVal;
    };
    el.getAttribute = function (name) {
      var n = String(name).toLowerCase();
      return attributes[n] !== undefined ? attributes[n] : null;
    };
    el.hasAttribute = function (name) {
      var n = String(name).toLowerCase();
      return attributes[n] !== undefined;
    };
    el.removeAttribute = function (name) {
      var n = String(name).toLowerCase();
      delete attributes[n];
      if (n === 'id') el.id = '';
      if (n === 'class') el.className = '';
    };

    el.classList = {
      add: function () {
        for (var i = 0; i < arguments.length; i++) {
          var c = arguments[i];
          var parts = el.className ? el.className.split(/\s+/) : [];
          if (parts.indexOf(c) === -1) {
            parts.push(c);
            el.className = parts.join(' ').trim();
          }
        }
      },
      remove: function () {
        for (var i = 0; i < arguments.length; i++) {
          var c = arguments[i];
          var parts = el.className ? el.className.split(/\s+/) : [];
          var idx = parts.indexOf(c);
          if (idx !== -1) {
            parts.splice(idx, 1);
            el.className = parts.join(' ').trim();
          }
        }
      },
      contains: function (c) {
        var parts = el.className ? el.className.split(/\s+/) : [];
        return parts.indexOf(c) !== -1;
      },
      toggle: function (c, force) {
        if (force === true || (force === undefined && !el.classList.contains(c))) {
          el.classList.add(c);
          return true;
        } else {
          el.classList.remove(c);
          return false;
        }
      },
    };

    // CRITICAL: sets parentNode so style.parentNode.removeChild(style) never throws
    el.appendChild = function (child) {
      if (!child) return child;
      if (child.nodeType === 11 && child.childNodes) {
        while (child.childNodes.length > 0) {
          el.appendChild(child.childNodes[0]);
        }
        return child;
      }
      if (child.parentNode && child.parentNode.removeChild) {
        child.parentNode.removeChild(child);
      }
      child.parentNode = el;
      child.parentElement = el;
      childNodes.push(child);
      return child;
    };

    el.insertBefore = function (newChild, refChild) {
      if (!newChild) return newChild;
      if (newChild.parentNode && newChild.parentNode.removeChild) {
        newChild.parentNode.removeChild(newChild);
      }
      newChild.parentNode = el;
      newChild.parentElement = el;
      var idx = childNodes.indexOf(refChild);
      if (idx !== -1) {
        childNodes.splice(idx, 0, newChild);
      } else {
        childNodes.push(newChild);
      }
      return newChild;
    };

    el.removeChild = function (child) {
      var idx = childNodes.indexOf(child);
      if (idx !== -1) {
        childNodes.splice(idx, 1);
        if (child) {
          child.parentNode = null;
          child.parentElement = null;
        }
      }
      return child;
    };

    el.replaceChild = function (newChild, oldChild) {
      el.insertBefore(newChild, oldChild);
      return el.removeChild(oldChild);
    };

    el.contains = function (other) {
      if (!other) return false;
      if (other === el) return true;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].contains && childNodes[i].contains(other)) return true;
      }
      return false;
    };

    el.cloneNode = function () {
      var cloned = createMockElement(tag, ownerDoc);
      cloned.className = el.className;
      cloned.id = el.id;
      cloned.textContent = el.textContent;
      for (var k in attributes) cloned.setAttribute(k, attributes[k]);
      return cloned;
    };

    el.querySelector = function (s) { return queryElement(el, s, false); };
    el.querySelectorAll = function (s) { return queryElement(el, s, true); };
    el.getElementsByTagName = function (t) {
      var target = String(t || '').toUpperCase();
      return queryElement(el, target === '*' ? '*' : target, true);
    };
    el.getElementsByClassName = function (c) {
      return queryElement(el, '.' + String(c || '').trim(), true);
    };
    el.getElementById = function (id) {
      return queryElement(el, '#' + String(id || '').trim(), false);
    };

    el.getBoundingClientRect = function () {
      return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, x: 0, y: 0 };
    };

    el.focus = function () { };
    el.blur = function () { };
    el.click = function () { };

    makeEventTarget(el);

    if (tag === 'STYLE') {
      var sheet = createStyleSheet(el);
      el.sheet = sheet;
      el.styleSheet = sheet;
    }

    return el;
  }

  // 9. Location stub
  var mockLocation = {
    href: 'http://localhost/',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    assign: function () { },
    replace: function () { },
    reload: function () { },
    toString: function () { return this.href; },
  };

  // 10. Instantiate or augment the global Document
  var doc =
    root.document && typeof root.document === 'object'
      ? root.document
      : Object.create(HTMLDocument.prototype);

  safeSet(doc, 'nodeType', 9);
  safeSet(doc, 'nodeName', '#document');
  safeSet(doc, 'defaultView', win);
  safeSet(doc, 'readyState', doc.readyState || 'complete');
  safeSet(doc, 'visibilityState', doc.visibilityState || 'visible');
  safeSet(doc, 'hidden', false);
  safeSet(doc, 'location', doc.location || mockLocation);
  safeSet(doc, 'cookie', doc.cookie || '');
  safeSet(doc, 'title', doc.title || '');
  safeSet(doc, 'referrer', doc.referrer || '');

  // Critical for @tolgee/web: document.documentElement.style
  if (!doc.documentElement || typeof doc.documentElement !== 'object') {
    doc.documentElement = createMockElement('html', doc);
  }
  if (!doc.documentElement.style) {
    doc.documentElement.style = createCSSStyleDeclaration();
  }

  // Ensure document.head
  if (!doc.head || typeof doc.head !== 'object' || !doc.head.appendChild) {
    var head = createMockElement('head', doc);
    doc.head = head;
    doc.documentElement.appendChild(head);
  }

  // Ensure document.body
  if (!doc.body || typeof doc.body !== 'object' || !doc.body.appendChild) {
    var body = createMockElement('body', doc);
    doc.body = body;
    doc.documentElement.appendChild(body);
  }

  if (!Array.isArray(doc.styleSheets)) {
    doc.styleSheets = [];
  }

  doc.createElement = doc.createElement || function (tag) {
    return createMockElement(tag, doc);
  };
  doc.createElementNS = doc.createElementNS || function (_, tag) {
    return createMockElement(tag, doc);
  };
  doc.createTextNode = doc.createTextNode || function (text) {
    var node = Object.create(Text.prototype);
    node.nodeType = 3;
    node.nodeName = '#text';
    node.textContent = String(text != null ? text : '');
    node.data = node.textContent;
    node.parentNode = null;
    node.parentElement = null;
    return node;
  };
  doc.createComment = doc.createComment || function (text) {
    var comment = Object.create(Comment.prototype);
    comment.nodeType = 8;
    comment.nodeName = '#comment';
    comment.textContent = String(text != null ? text : '');
    comment.data = comment.textContent;
    comment.parentNode = null;
    return comment;
  };
  doc.createDocumentFragment = doc.createDocumentFragment || function () {
    var frag = Object.create(DocumentFragment.prototype);
    var children = [];
    frag.nodeType = 11;
    frag.nodeName = '#document-fragment';
    frag.childNodes = children;
    frag.children = children;
    frag.appendChild = function (child) {
      if (child) children.push(child);
      return child;
    };
    return frag;
  };

  doc.getElementById = function (id) {
    return queryElement(doc.documentElement, '#' + String(id || '').trim(), false);
  };
  doc.getElementsByTagName = function (tagName) {
    var tag = String(tagName || '').toUpperCase();
    if (tag === 'HEAD') return [doc.head];
    if (tag === 'BODY') return [doc.body];
    if (tag === 'HTML') return [doc.documentElement];
    return queryElement(doc.documentElement, tag === '*' ? '*' : tag, true);
  };
  doc.getElementsByClassName = function (className) {
    return queryElement(doc.documentElement, '.' + String(className || '').trim(), true);
  };
  doc.querySelector = function (selector) {
    var s = String(selector || '').trim();
    if (s.toLowerCase() === 'head') return doc.head;
    if (s.toLowerCase() === 'body') return doc.body;
    if (s.toLowerCase() === 'html') return doc.documentElement;
    return queryElement(doc.documentElement, s, false);
  };
  doc.querySelectorAll = function (selector) {
    var s = String(selector || '').trim();
    if (s.toLowerCase() === 'head') return [doc.head];
    if (s.toLowerCase() === 'body') return [doc.body];
    if (s.toLowerCase() === 'html') return [doc.documentElement];
    return queryElement(doc.documentElement, s, true);
  };
  doc.contains = function (other) {
    return doc.documentElement.contains(other);
  };

  makeEventTarget(doc);

  // 11. Stubs for MutationObserver, getComputedStyle, matchMedia, RAF
  function MutationObserver(callback) {
    this._callback = callback;
  }
  MutationObserver.prototype.observe = function () { };
  MutationObserver.prototype.disconnect = function () { };
  MutationObserver.prototype.takeRecords = function () { return []; };

  function CustomEvent(type, params) {
    params = params || {};
    this.type = String(type);
    this.detail = params.detail !== undefined ? params.detail : null;
    this.bubbles = Boolean(params.bubbles);
    this.cancelable = Boolean(params.cancelable);
  }

  function Event(type, params) {
    params = params || {};
    this.type = String(type);
    this.bubbles = Boolean(params.bubbles);
    this.cancelable = Boolean(params.cancelable);
  }

  function getComputedStyle(el) {
    var s = (el && el.style) || {};
    return {
      getPropertyValue: function (prop) {
        return s.getPropertyValue ? s.getPropertyValue(prop) : s[prop] || '';
      },
    };
  }

  function matchMedia(query) {
    return {
      media: String(query || ''),
      matches: false,
      onchange: null,
      addListener: function () { },
      removeListener: function () { },
      addEventListener: function () { },
      removeEventListener: function () { },
      dispatchEvent: function () { return true; },
    };
  }

  makeEventTarget(win);

  if (typeof win.requestAnimationFrame === 'undefined') {
    safeSet(win, 'requestAnimationFrame', function (cb) { return setTimeout(cb, 16); });
  }
  if (typeof win.cancelAnimationFrame === 'undefined') {
    safeSet(win, 'cancelAnimationFrame', function (id) { clearTimeout(id); });
  }

  if (typeof win.navigator === 'undefined') {
    safeSet(win, 'navigator', { userAgent: 'ReactNative', product: 'ReactNative' });
  } else if (!win.navigator.userAgent) {
    safeSet(win.navigator, 'userAgent', 'ReactNative');
  }

  // 12. Broadcast all globals across every global environment alias.
  // In Hermes, free identifier lookup accesses `globalThis`. Attaching them
  // to all aliases guarantees bare `document`, `HTMLElement`, `Node`, etc. never throw.
  var targetGlobals = [];
  function addTarget(t) {
    if (t && typeof t === 'object' && targetGlobals.indexOf(t) === -1) {
      targetGlobals.push(t);
    }
  }
  addTarget(root);
  if (typeof globalThis !== 'undefined') addTarget(globalThis);
  if (typeof global !== 'undefined') addTarget(global);
  if (typeof window !== 'undefined') addTarget(window);
  if (typeof self !== 'undefined') addTarget(self);

  var globalExports = {
    document: doc,
    window: win,
    location: mockLocation,
    Node: Node,
    Element: Element,
    HTMLElement: HTMLElement,
    HTMLStyleElement: HTMLStyleElement,
    HTMLHeadElement: HTMLHeadElement,
    HTMLBodyElement: HTMLBodyElement,
    HTMLHtmlElement: HTMLHtmlElement,
    Document: Document,
    HTMLDocument: HTMLDocument,
    DocumentFragment: DocumentFragment,
    Text: Text,
    Comment: Comment,
    CSSStyleSheet: CSSStyleSheet,
    MutationObserver: MutationObserver,
    CustomEvent: CustomEvent,
    Event: Event,
    getComputedStyle: getComputedStyle,
    matchMedia: matchMedia,
  };

  for (var i = 0; i < targetGlobals.length; i++) {
    var gObj = targetGlobals[i];
    for (var key in globalExports) {
      if (typeof gObj[key] === 'undefined' || key === 'document') {
        safeSet(gObj, key, globalExports[key]);
      }
    }
  }
})();