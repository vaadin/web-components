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
