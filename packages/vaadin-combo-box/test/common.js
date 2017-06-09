
var ua = navigator.userAgent;
var ios = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
var chrome = /Chrome/i.test(ua);
var edge = /Edge/i.test(ua);
var ie11 = /Trident/i.test(ua);
var linux = /Linux/i.test(ua);

const touchDevice = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

const fire = (type, node, detail) => {
  const evt = new CustomEvent(type, {detail: detail, bubbles: true, cancelable: true, composed: true});
  node.dispatchEvent(evt);

  return evt;
};

const describeSkipIf = (bool, title, callback) => {
  bool = typeof bool == 'function' ? bool() : bool;
  if (bool) {
    describe.skip(title, callback);
  } else {
    describe(title, callback);
  }
};

const describeIf = (bool, title, callback) => {
  bool = typeof bool == 'function' ? bool() : bool;
  describeSkipIf(!bool, title, callback);
};

const getItemArray = length => {
  return new Array(length).join().split(',')
    .map((item, index) => 'item ' + index);
};

// IE11 causes an 'Error thrown outside of test function: Unspecified error' after running
// tests that open the overlay. The problem seems related with some code that vaadin-text-field
// moves the focus async in the input field (vaadin-text-field).
function hackIE11Focus(cb) {
  if (ie11) {
    setTimeout(() => {
      document.body.focus();
      cb();
    });
  } else {
    cb();
  }
}

function open(comboBox, cb) {
  function doOpen() {
    comboBox.open();
    setTimeout(cb);
  }

  if (ie11) {
    comboBox.focus();
    setTimeout(doOpen);
  } else {
    doOpen();
  }
}

