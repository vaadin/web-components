/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const getOutlineTarget = (element, tagName) => {
  switch (tagName) {
    /* c8 ignore next */
    case 'vaadin-big-decimal-field':
    case 'vaadin-combo-box':
    case 'vaadin-date-picker':
    case 'vaadin-email-field':
    case 'vaadin-integer-field':
    case 'vaadin-number-field':
    case 'vaadin-password-field':
    case 'vaadin-select':
    case 'vaadin-text-area':
    case 'vaadin-text-field':
    case 'vaadin-time-picker':
      return element.shadowRoot.querySelector('[part="input-field"]');
    /* c8 ignore next */
    case 'vaadin-checkbox':
      return element.shadowRoot.querySelector('[part="checkbox"]');
    /* c8 ignore next */
    case 'vaadin-radio-button':
      return element.shadowRoot.querySelector('[part="radio"]');
    /* c8 ignore next */
    default:
      return element;
  }
};

const fields = new WeakMap();

export const initOutline = (field) => {
  if (!fields.has(field)) {
    // Get target to attach instance
    const tagName = field.tagName.toLowerCase();
    const target = getOutlineTarget(field, tagName);

    // Some components set this, but not all
    target.style.position = 'relative';

    if (tagName.endsWith('text-area')) {
      target.style.overflow = 'visible';
    }

    const style = document.createElement('style');
    style.textContent = `
      :host([active]) [part="outline"],
      :host([focus-ring]) [part="outline"] {
        display: none;
      }
    `;
    field.shadowRoot.appendChild(style);

    const outline = document.createElement('vaadin-field-outline');
    (target === field ? field.shadowRoot : target).appendChild(outline);

    // Mimic :host-context to apply styles
    outline.setAttribute('context', tagName);

    fields.set(field, { root: field, target, outline });
  }

  return fields.get(field);
};
