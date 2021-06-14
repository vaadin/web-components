import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-item/theme/lumo/vaadin-item.js';

/* TODO partly duplicated from vaadin-list-box styles. Should find a way to make it DRY */
registerStyles(
  'vaadin-combo-box-item',
  css`
    :host {
      cursor: default;
      -webkit-tap-highlight-color: var(--lumo-primary-color-10pct);
      padding-left: calc(var(--lumo-border-radius-m) / 4);
      padding-right: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
      transition: background-color 100ms;
      border-radius: var(--lumo-border-radius-m);
      overflow: hidden;
      --_lumo-item-selected-icon-display: block;
    }

    :host(:hover) {
      background-color: var(--lumo-primary-color-10pct);
    }

    :host([focused]:not([disabled])) {
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    @media (pointer: coarse) {
      :host(:hover) {
        background-color: transparent;
      }

      :host([focused]:not([disabled])) {
        box-shadow: none;
      }
    }

    /* RTL specific styles */
    :host([dir='rtl']) {
      padding-right: calc(var(--lumo-border-radius-m) / 4);
      padding-left: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
    }
  `,
  { moduleId: 'lumo-combo-box-item', include: ['lumo-item'] }
);
