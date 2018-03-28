// Note: var is used in this file, otherwise with const there are errors
// in Safari when running tests after modulizer (Polymer 3)

var ua = navigator.userAgent;
var ios = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
var edge = /Edge/i.test(ua);
var linux = /Linux/i.test(ua);

var touchDevice = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

var getCustomPropertyValue = (el, prop) => {
  return window.ShadyCSS ?
    window.ShadyCSS.getComputedStyleValue(el, prop) :
    getComputedStyle(el).getPropertyValue(prop);
};

var fire = (type, node, detail) => {
  var evt = new CustomEvent(type, {detail: detail, bubbles: true, cancelable: true, composed: true});
  node.dispatchEvent(evt);

  return evt;
};

var fireMousedownMouseupClick = (node) => {
  fire('mousedown', node);
  fire('mouseup', node);
  fire('click', node);
};

var describeSkipIf = (bool, title, callback) => {
  bool = typeof bool == 'function' ? bool() : bool;
  if (bool) {
    describe.skip(title, callback);
  } else {
    describe(title, callback);
  }
};

var describeIf = (bool, title, callback) => {
  bool = typeof bool == 'function' ? bool() : bool;
  describeSkipIf(!bool, title, callback);
};

var getItemArray = length => {
  return new Array(length).join().split(',')
    .map((item, index) => 'item ' + index);
};

// IE11 throws errors when the fixture is removed from the DOM and the focus remains in the native input.
// Also, FF and Chrome are unable to focus the input when tests are run in the headless window manager used in Travis
function monkeyPatchTextFieldFocus() {
  if (window.Vaadin) {
    Vaadin.TextFieldElement.prototype.focus = function() {
      this._setFocused(true);
    };
    Vaadin.TextFieldElement.prototype.blur = function() {
      this._setFocused(false);
    };
  }
}

if (window.Polymer) { // Chrome
  setTimeout(monkeyPatchTextFieldFocus, 1);
} else { // Polyfill
  window.addEventListener('WebComponentsReady', monkeyPatchTextFieldFocus);
}
