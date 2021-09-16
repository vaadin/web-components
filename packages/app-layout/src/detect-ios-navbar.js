export const _detectIosNavbar = function () {
  /* c8 ignore next 11 */
  if (window.navigator.userAgent.match(/iPhone|iPad/i)) {
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    const landscape = innerWidth > innerHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (landscape && clientHeight > innerHeight) {
      document.documentElement.style.setProperty('--vaadin-viewport-offset-bottom', clientHeight - innerHeight + 'px');
    } else {
      document.documentElement.style.setProperty('--vaadin-viewport-offset-bottom', '');
    }
  }
};

_detectIosNavbar();
window.addEventListener('resize', _detectIosNavbar);
