function tap(element) {
  Polymer.Base.fire('tap', {}, {
    bubbles: true,
    node: element
  });
}

function waitUntilLocaleAvailable(locale, callback) {
  if (moment.localeData(locale)) {
    callback();
  } else {
    setTimeout(waitUntilLocaleAvailable, 10, locale, callback);
  }
}

function monthsEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

function getFirstVisibleItem(scroller) {
  var children = [];
  scroller._buffers.forEach(function(buffer) {
    [].forEach.call(buffer.children, function(itemWrapper) {
      children.push(itemWrapper);
    });
  });
  return children.reduce(function(prev, current) {
    return (Math.floor(current.getBoundingClientRect().top) - Math.floor(scroller.getBoundingClientRect().top) <= 0) ? current : prev;
  });
}
