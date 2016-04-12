var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var chrome = /Chrome/i.test(navigator.userAgent);
var safari = !chrome && /Safari/i.test(navigator.userAgent);

var touchDevice = (function() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

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
