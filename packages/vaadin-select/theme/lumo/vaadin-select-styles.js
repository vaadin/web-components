import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import '@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field.js';
import '@vaadin/vaadin-item/theme/lumo/vaadin-item.js';
import '@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box.js';

registerStyles(
  'vaadin-select',
  css`
    :host {
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    [selected] {
      padding-left: 0;
      padding-right: 0;
      flex: auto;
    }

    :host([theme~='small']) [selected] {
      padding: 0;
      min-height: var(--lumo-size-s);
    }

    :host([theme~='align-left']) [selected] {
      text-align: left;
    }

    :host([theme~='align-right']) [selected] {
      text-align: right;
    }

    :host([theme~='align-center']) [selected] {
      text-align: center;
    }

    [part='toggle-button']::before {
      content: var(--lumo-icons-dropdown);
    }

    /* Highlight the toggle button when hovering over the entire component */
    :host(:hover:not([readonly]):not([disabled])) [part='toggle-button'] {
      color: var(--lumo-contrast-80pct);
    }
  `,
  { include: ['lumo-field-button'], moduleId: 'lumo-select' }
);

registerStyles(
  'vaadin-select-text-field',
  css`
    :host([theme~='align-center']) ::slotted([part~='value']) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
    }

    :host([theme~='align-center']) ::slotted([part~='value']) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right']) ::slotted([part~='value']) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
    }

    [part='input-field'] {
      cursor: default;
    }

    [part='input-field'] ::slotted([part='value']) {
      display: flex;
    }

    [part='input-field']:focus {
      outline: none;
    }

    /* RTL specific styles */
    :host([theme~='align-left'][dir='rtl']) ::slotted([part~='value']) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
    }

    :host([theme~='align-center'][dir='rtl']) ::slotted([part~='value']) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([dir='rtl']) ::slotted([part~='value']),
    :host([theme~='align-right'][dir='rtl']) ::slotted([part~='value']) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
    }
  `,
  { moduleId: 'lumo-select-text-field' }
);

registerStyles(
  'vaadin-select-overlay',
  css`
    :host {
      --_lumo-item-selected-icon-display: block;
    }

    :host([bottom-aligned]) {
      justify-content: flex-end;
    }

    [part~='overlay'] {
      min-width: var(--vaadin-select-text-field-width);
    }

    /* Small viewport adjustment */
    :host([phone]) {
      top: 0 !important;
      right: 0 !important;
      bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
      left: 0 !important;
      align-items: stretch;
      justify-content: flex-end;
    }

    :host([theme~='align-left']) {
      text-align: left;
    }

    :host([theme~='align-right']) {
      text-align: right;
    }

    :host([theme~='align-center']) {
      text-align: center;
    }
  `,
  { include: ['lumo-menu-overlay'], moduleId: 'lumo-select-overlay' }
);
