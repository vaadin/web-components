var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var chrome = /Chrome/i.test(navigator.userAgent);
var edge = /Edge/i.test(navigator.userAgent);

var touchDevice = (function() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

// naming this fireEvent instead of fire to distinguish it from Polymer.Base.fire
var fireEvent = (type, node, detail) => {
  var evt = new CustomEvent(type, {detail: detail, bubbles: true, cancelable: true, composed: true});
  node.dispatchEvent(evt);

  return evt;
};

var describeSkipIf = function(bool, title, callback) {
  bool = typeof bool == 'function' ? bool() : bool;
  if (bool) {
    describe.skip(title, callback);
  } else {
    describe(title, callback);
  }
};

var describeIf = function(bool, title, callback) {
  bool = typeof bool == 'function' ? bool() : bool;
  describeSkipIf(!bool, title, callback);
};

var getItemArray = function(length) {
  return new Array(length).join().split(',')
    .map(function(item, index) {
      return 'item ' + index;
    });
};