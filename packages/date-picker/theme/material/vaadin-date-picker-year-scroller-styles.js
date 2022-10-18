import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker-year-scroller',
  css`
    :host {
      background: var(--material-secondary-text-color);
      color: var(--material-background-color);
      font-size: var(--material-body-font-size);
      font-weight: 400;
      line-height: 1.4;
      text-align: center;
    }

    :host::before {
      border: 0;
      width: 8px;
      height: 8px;
      transform: translateX(-50%) rotate(-45deg);
      background: var(--material-background-color);
    }
  `,
  { moduleId: 'material-date-picker-year-scroller' },
);
