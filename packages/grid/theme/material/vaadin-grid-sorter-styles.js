import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-sorter',
  css`
    :host {
      justify-content: flex-start;
      height: 100%;
      align-items: center;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    :host([direction]) {
      color: var(--material-body-text-color);
    }

    [part='indicators'] {
      order: -1;
    }

    [part='indicators']::before {
      display: inline-block;
      width: 24px;
      font-family: 'material-icons';
      font-size: 18px;
      line-height: 18px;
      transition: 0.1s opacity cubic-bezier(0.4, 0, 0.2, 0.1), 0.1s width cubic-bezier(0.4, 0, 0.2, 0.1);
      opacity: 0.5;
    }

    :host(:not([direction])) [part='indicators']::before {
      content: var(--material-icons-arrow-upward);
      width: 0;
      opacity: 0;
    }

    :host([direction]) [part='indicators']::before {
      opacity: 1;
    }

    :host([direction='asc']) [part='indicators']::before {
      content: var(--material-icons-arrow-upward);
    }

    :host([direction='desc']) [part='indicators']::before {
      content: var(--material-icons-arrow-downward);
    }

    :host(:hover) [part='indicators']::before {
      width: 24px;
      opacity: 1;
    }

    [part='order'] {
      right: 4px;
      top: -8px;
      font-size: 10px;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part='order'] {
      left: 4px;
      right: auto;
    }
  `,
  { moduleId: 'material-grid-sorter' }
);
