import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-item/theme/material/vaadin-item.js';

registerStyles(
  'vaadin-combo-box-item',
  css`
    :host {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      padding: 4px 10px;
      min-height: 36px;
      font-size: var(--material-small-font-size);
      --_material-item-selected-icon-display: block;
    }

    :host(:hover) {
      background-color: var(--material-secondary-background-color);
    }

    :host([focused]) {
      background-color: var(--material-divider-color);
    }

    @media (pointer: coarse) {
      :host(:hover),
      :host([focused]) {
        background-color: transparent;
      }
    }
  `,
  { moduleId: 'material-combo-box-item', include: ['material-item'] }
);
