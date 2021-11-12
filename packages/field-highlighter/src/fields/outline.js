/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const getOutlineTarget = (element) => {
  switch (element.tagName.toLowerCase()) {
    /* c8 ignore next */
    case 'vaadin-big-decimal-field':
    case 'vaadin-combo-box':
    case 'vaadin-date-picker':
    case 'vaadin-date-time-picker-date-picker':
    case 'vaadin-date-time-picker-time-picker':
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
    const target = getOutlineTarget(field);

    // Some components set this, but not all
    target.style.position = 'relative';

    const style = document.createElement('style');
    style.textContent = `
      :host([active]) [part="outline"],
      :host([focus-ring]) [part="outline"],
      :host([focus-ring]) ::slotted([part="outline"]) {
        display: none;
      }
    `;
    field.shadowRoot.appendChild(style);

    const tagName = field.tagName.toLowerCase();
    const outline = document.createElement('vaadin-field-outline');

    // Append outline to text-area light DOM
    if (tagName.endsWith('text-area')) {
      outline.setAttribute('slot', 'textarea');
      target.style.overflow = 'visible';
      field.appendChild(outline);
    } else {
      (target === field ? field.shadowRoot : target).appendChild(outline);
    }

    // Mimic :host-context to apply styles
    outline.setAttribute('context', tagName);

    fields.set(field, { root: field, target, outline });
  }

  return fields.get(field);
};
