import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-item/theme/material/vaadin-item.js';
import '@vaadin/vaadin-list-box/theme/material/vaadin-list-box.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import '@vaadin/vaadin-material-styles/mixins/field-button.js';

registerStyles(
  'vaadin-select',
  css`
    :host {
      display: inline-flex;
      -webkit-tap-highlight-color: transparent;
    }

    [part='toggle-button']::before {
      content: var(--material-icons-dropdown);
    }

    :host([opened]) [part='toggle-button'] {
      transform: rotate(180deg);
    }

    :host([disabled]) {
      pointer-events: none;
    }
  `,
  { include: ['material-field-button'], moduleId: 'material-select' }
);

registerStyles(
  'vaadin-select-text-field',
  css`
    :host {
      width: 100%;
    }

    :host([disabled]) [part='input-field'],
    [part='input-field'],
    [part='value'] {
      cursor: default;
    }

    [part='input-field']:focus {
      outline: none;
    }

    ::slotted([part='value']) {
      display: flex;
    }
  `,
  { moduleId: 'material-select-text-field' }
);

registerStyles(
  'vaadin-select-overlay',
  css`
    :host([bottom-aligned]) {
      justify-content: flex-end;
    }

    [part='overlay'] {
      min-width: var(--vaadin-select-text-field-width);
    }
  `,
  { include: ['material-menu-overlay'], moduleId: 'material-select-overlay' }
);
