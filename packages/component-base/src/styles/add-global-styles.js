/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Add a `<style>` block with given styles to the document.
 *
 * @param {string} id the id to set on the created element, only for informational purposes
 * @param  {CSSResultGroup[]} styles the styles to add
 */
export const addGlobalStyles = (id, ...styles) => {
  const styleTag = document.createElement('style');
  styleTag.id = id;
  styleTag.textContent = styles.map((style) => style.toString()).join('\n');

  document.head.insertAdjacentElement('afterbegin', styleTag);
};
