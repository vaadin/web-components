/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export { registerStyles, css, unsafeCSS } from './vaadin-themable-mixin.js';

export const addGlobalThemeStyles = (id, prefix, ...styles) => {
  const styleTag = document.createElement('style');
  styleTag.id = `${prefix}${id}`;
  styleTag.textContent = styles
    .map((style) => style.toString())
    .join('\n')
    .replace(':host', 'html');

  document.head.insertAdjacentElement('afterbegin', styleTag);
};
