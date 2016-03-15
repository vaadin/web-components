var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1 && navigator.userAgent.toLowerCase().indexOf('chrome/') == -1;

function tap(element) {
  Polymer.Base.fire('tap', {}, {
    bubbles: true,
    node: element
  });
}

function monthsEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

function getFirstVisibleItem(scroller, bufferOffset) {
  var children = [];
  bufferOffset = (bufferOffset ||  0);

  scroller._buffers.forEach(function(buffer) {
    [].forEach.call(buffer.children, function(itemWrapper) {
      children.push(itemWrapper);
    });
  });
  var scrollerRect = scroller.getBoundingClientRect();
  return children.reduce(function(prev, current) {
    return (Math.floor(current.getBoundingClientRect().top) - Math.floor(scrollerRect.top + bufferOffset) <= 0) ? current : prev;
  });
}

function isFullscreen(datepicker) {
  return datepicker.$.overlay.getAttribute('fullscreen') !== null;
}

function describeSkipIf(bool, title, callback) {
  bool = typeof bool == 'function' ? bool() : bool;
  if (bool) {
    describe.skip(title, callback);
  } else {
    describe(title, callback);
  }
}

function waitUntilScrolledTo(overlay, date, callback) {
  if (overlay.$.scroller.position) {
    overlay._onMonthScroll();
  }
  var monthIndex = overlay._differenceInMonths(date, new Date());
  if (overlay.$.scroller.position === monthIndex) {
    callback();
  } else {
    setTimeout(waitUntilScrolledTo, 10, overlay, date, callback);
  }
}
