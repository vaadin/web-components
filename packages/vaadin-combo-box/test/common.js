var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var fullScreen = (function() {
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

var asyncDone = function(cb, done, timeout) {
  Polymer.Base.async(function() {
    try {
      cb();
      if (done) {
        done();
      }
    } catch (err) {
      if (done) {
        done(err);
      } else {
        throw (err);
      }
    }
  }, timeout || 1);
};

function _waitUntilOpened(open) {
  if (!window.Promise) {
    window.Promise = MakePromise(Polymer.Base.async);
  }

  return new Promise(function(resolve, reject) {
    var handle = setInterval(function() {
      var combobox = document.querySelector('vaadin-combo-box');

      if (combobox.opened == open && !combobox.$.overlay.$.dropdown._openChangedAsync) {
        clearInterval(handle);
        resolve();
      }
    }, 10);
  });
}

var waitUntilOpen = function() {
  return _waitUntilOpened(true);
};

var waitUntilClosed = function() {
  return _waitUntilOpened(false);
};

var getItemArray = function(length) {
  return new Array(length).join().split(',')
    .map(function(item, index) {
      return 'item ' + index;
    });
};
