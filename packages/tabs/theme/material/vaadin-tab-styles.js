import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tab',
  css`
    :host {
      display: flex;
      position: relative;
      box-sizing: border-box;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      min-width: 90px;
      min-height: 48px;
      padding: 12px 16px;
      overflow: hidden;
      transition: box-shadow 0.3s;
      outline: none;
      color: var(--material-secondary-text-color);
      font-family: var(--material-font-family);
      font-size: var(--material-button-font-size);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 500;
      letter-spacing: 0.05em;
      line-height: 1.2;
      text-align: center;
      text-transform: uppercase;
      white-space: nowrap;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
    }

    /* do not prevent click on slotted links */
    :host::before,
    :host::after {
      pointer-events: none;
    }

    :host::before {
      content: '';
      position: absolute;
      transition: opacity 0.1s linear;
      opacity: 0;
      background-color: var(--material-primary-color);
      inset: 0;
    }

    :host(:hover)::before {
      opacity: 0.04;
    }

    :host([focus-ring])::before {
      opacity: 0.1;
    }

    :host([selected]) {
      box-shadow: inset 0 -2px 0 0 var(--material-primary-color);
      color: var(--material-primary-text-color);
    }

    :host([orientation='vertical'][selected]) {
      box-shadow: inset 2px 0 0 0 var(--material-primary-color);
    }

    /* Ripple */

    :host::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      transform: translate(-50%, -50%) scale(0);
      transition:
        transform 0s cubic-bezier(0.05, 0.8, 0.5, 1),
        opacity 0s linear;
      border-radius: 50%;
      opacity: 0;
      background-color: var(--material-primary-color);
    }

    :host([focused]:not([focus-ring]))::after,
    :host([focused][active])::after,
    :host([focus-ring][selected])::after {
      transform: translate(-50%, -50%) scale(3);
      transition-duration: 2s, 0.6s;
      opacity: 0;
    }

    :host([active]:not([selected]))::after {
      transition-duration: 2s, 0s;
      opacity: 0.2;
    }

    /* Disabled */
    :host([disabled]) {
      opacity: 1;
      color: var(--material-disabled-text-color);
      pointer-events: none;
    }

    :host ::slotted(a) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      margin: -12px -16px;
      padding: 12px 16px;
      outline: none;
      color: inherit;
      text-decoration: none;
    }

    /* Touch device adjustments */
    @media (pointer: coarse) {
      :host(:hover)::before {
        display: none;
      }
    }

    /* Small space between icon and label */
    ::slotted(vaadin-icon:not(:only-child)) {
      margin-bottom: 8px;
    }

    /* RTL specific styles */

    :host([dir='rtl'][orientation='vertical'][selected]) {
      box-shadow: inset -2px 0 0 0 var(--material-primary-color);
    }
  `,
  { moduleId: 'material-tab' },
);
