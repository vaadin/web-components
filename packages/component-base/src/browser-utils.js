/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export const isAndroid = /android/i.test(navigator.userAgent);

export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export const isIOS =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
