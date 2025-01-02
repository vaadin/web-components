/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isIOS } from '@vaadin/component-base/src/browser-utils.js';

export function _detectIosNavbar() {
  /* c8 ignore next 11 */
  if (isIOS) {
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    const landscape = innerWidth > innerHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (landscape && clientHeight > innerHeight) {
      document.documentElement.style.setProperty('--vaadin-viewport-offset-bottom', `${clientHeight - innerHeight}px`);
    } else {
      document.documentElement.style.setProperty('--vaadin-viewport-offset-bottom', '');
    }
  }
}

_detectIosNavbar();
window.addEventListener('resize', _detectIosNavbar);
