var fullScreen = (function() {
  try {
    document.createEvent("TouchEvent");
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

var asyncDone = function(cb, done, timeout) {
  Polymer.Base.async(function() {
    try {
      cb();
      if (done) done();
    } catch (err) {
      if (done) done(err);
      else throw(err);
    }
  }, timeout);
};

var items20 = [];
for (var i = 0; i < 20; i++) {
  items20.push('item ' + i)
}
