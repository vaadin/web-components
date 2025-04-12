import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-month-calendar',
  css`
    :host {
      color: var(--material-body-text-color);
      padding: 0 calc(50% / 8 - 0.5em + 8px);
    }

    :host([show-week-numbers]) {
      padding: 0 calc(50% / 9 - 0.5em + 8px);
    }

    [part='month-header'] {
      font-size: var(--material-h6-font-size);
      line-height: 1;
      margin-bottom: 8px;
      padding-top: 20px;
    }

    [part='week-number'],
    [part='weekday'] {
      color: var(--material-secondary-text-color);
      font-size: var(--material-caption-font-size);
      height: 40px;
      line-height: 44px;
    }

    :host([disabled]),
    :host([disabled]) [part='week-number'],
    :host([disabled]) [part='weekday'] {
      color: var(--material-disabled-text-color);
    }

    [part~='date'] {
      cursor: default;
      font-size: var(--material-body-font-size);
      height: 40px;
      line-height: 42px;
      position: relative;
    }

    [part~='date']::after {
      border: 2px solid transparent;
      border-radius: 50%;
      box-sizing: border-box;
      content: '';
      height: 38px;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 38px;
      z-index: -4;
    }

    /* Today */

    [part~='date'][part~='today'] {
      color: var(--material-primary-text-color);
    }

    /* Hover */

    [part~='date']:not([part~='disabled']):hover::after {
      background-color: var(--material-secondary-background-color);
      border-color: var(--material-secondary-background-color);
      z-index: -3;
    }

    /* Hide for touch devices */
    @media (hover: none) {
      [part~='date']:not([part~='disabled']):hover::after {
        background-color: transparent;
        border-color: transparent;
        z-index: -4;
      }
    }

    /* Selected */

    [part~='date'][part~='selected'] {
      font-weight: 500;
    }

    [part~='date']:not([part~='disabled'])[part~='selected']::after,
    [part~='date'][part~='selected']::after {
      background-color: transparent;
      border-color: currentColor;
      z-index: -2;
    }

    /* Focused */

    [part~='date']:not([part~='disabled'])[part~='focused'],
    [part~='date']:not([part~='disabled']):active {
      color: var(--material-primary-contrast-color);
    }

    [part~='date']:not([part~='disabled'])[part~='focused']::after,
    [part~='date']:not([part~='disabled']):active::after {
      background-color: var(--material-primary-color);
      border-color: var(--material-primary-color);
      opacity: 0.7;
      z-index: -1;
    }

    [part~='date'][part~='disabled'] {
      color: var(--material-disabled-text-color);
    }

    :host([focused]) [part~='date']:not([part~='disabled'])[part~='focused']::after {
      opacity: 1;
    }
  `,
  { moduleId: 'material-date-picker-month-calendar' },
);
