import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-month-calendar',
  css`
    :host {
      padding: 0 calc(50% / 8 - 0.5em + 8px);
      color: var(--material-body-text-color);
    }

    :host([show-week-numbers]) {
      padding: 0 calc(50% / 9 - 0.5em + 8px);
    }

    [part='month-header'] {
      padding-top: 20px;
      margin-bottom: 8px;
      font-size: var(--material-h6-font-size);
      line-height: 1;
    }

    [part='week-number'],
    [part='weekday'] {
      height: 40px;
      color: var(--material-secondary-text-color);
      font-size: var(--material-caption-font-size);
      line-height: 44px;
    }

    :host([disabled]),
    :host([disabled]) [part='week-number'],
    :host([disabled]) [part='weekday'] {
      color: var(--material-disabled-text-color);
    }

    [part~='date'] {
      position: relative;
      height: 40px;
      cursor: default;
      font-size: var(--material-body-font-size);
      line-height: 42px;
    }

    [part~='date']::after {
      position: absolute;
      z-index: -4;
      top: 50%;
      left: 50%;
      width: 38px;
      height: 38px;
      box-sizing: border-box;
      border: 2px solid transparent;
      border-radius: 50%;
      content: '';
      transform: translate(-50%, -50%);
    }

    /* Today */

    [part~='date'][part~='today'] {
      color: var(--material-primary-text-color);
    }

    /* Hover */

    [part~='date']:not([part~='disabled']):hover::after {
      z-index: -3;
      border-color: var(--material-secondary-background-color);
      background-color: var(--material-secondary-background-color);
    }

    /* Hide for touch devices */
    @media (hover: none) {
      [part~='date']:not([part~='disabled']):hover::after {
        z-index: -4;
        border-color: transparent;
        background-color: transparent;
      }
    }

    /* Selected */

    [part~='date'][part~='selected'] {
      font-weight: 500;
    }

    [part~='date']:not([part~='disabled'])[part~='selected']::after,
    [part~='date'][part~='selected']::after {
      z-index: -2;
      border-color: currentColor;
      background-color: transparent;
    }

    /* Focused */

    [part~='date']:not([part~='disabled'])[part~='focused'],
    [part~='date']:not([part~='disabled']):active {
      color: var(--material-primary-contrast-color);
    }

    [part~='date']:not([part~='disabled'])[part~='focused']::after,
    [part~='date']:not([part~='disabled']):active::after {
      z-index: -1;
      border-color: var(--material-primary-color);
      background-color: var(--material-primary-color);
      opacity: 0.7;
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
