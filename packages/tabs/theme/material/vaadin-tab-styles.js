import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tab',
  css`
    :host {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-width: 90px;
      padding: 12px 16px;
      box-sizing: border-box;
      font-family: var(--material-font-family);
      font-size: var(--material-button-font-size);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      min-height: 48px;
      line-height: 1.2;
      font-weight: 500;
      color: var(--material-secondary-text-color);
      overflow: hidden;
      position: relative;
      cursor: pointer;
      outline: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: box-shadow 0.3s;
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
      inset: 0;
      background-color: var(--material-primary-color);
      opacity: 0;
      transition: opacity 0.1s linear;
    }

    :host(:hover)::before {
      opacity: 0.04;
    }

    :host([focus-ring])::before {
      opacity: 0.1;
    }

    :host([selected]) {
      color: var(--material-primary-text-color);
      box-shadow: inset 0 -2px 0 0 var(--material-primary-color);
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
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      background-color: var(--material-primary-color);
      opacity: 0;
      transition:
        transform 0s cubic-bezier(0.05, 0.8, 0.5, 1),
        opacity 0s linear;
    }

    :host([focused]:not([focus-ring]))::after,
    :host([focused][active])::after,
    :host([focus-ring][selected])::after {
      transform: translate(-50%, -50%) scale(3);
      opacity: 0;
      transition-duration: 2s, 0.6s;
    }

    :host([active]:not([selected]))::after {
      opacity: 0.2;
      transition-duration: 2s, 0s;
    }

    /* Disabled */
    :host([disabled]) {
      pointer-events: none;
      opacity: 1;
      color: var(--material-disabled-text-color);
    }

    :host ::slotted(a) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      margin: -12px -16px;
      padding: 12px 16px;
      text-decoration: none;
      color: inherit;
      outline: none;
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
