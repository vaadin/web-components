var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var chrome = /Chrome/i.test(navigator.userAgent);
var edge = /Edge/i.test(navigator.userAgent);

var touchDevice = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

var fire = (type, node, detail) => {
  var evt = new CustomEvent(type, {detail: detail, bubbles: true, cancelable: true, composed: true});
  node.dispatchEvent(evt);

  return evt;
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
