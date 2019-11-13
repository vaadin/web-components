window.VaadinCookieConsentSuites = [
  'change-texts-test.html',
  'basic-test.html'
];

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (!isIOS) {
  window.VaadinCookieConsentSuites.push('accessibility-test.html');
}
