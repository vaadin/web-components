import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tab',
  css`
    :host {
      align-items: center;
      box-sizing: border-box;
      color: var(--material-secondary-text-color);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 0;
      font-family: var(--material-font-family);
      font-size: var(--material-button-font-size);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 500;
      justify-content: center;
      letter-spacing: 0.05em;
      line-height: 1.2;
      min-height: 48px;
      min-width: 90px;
      outline: none;
      overflow: hidden;
      padding: 12px 16px;
      position: relative;
      text-align: center;
      text-transform: uppercase;
      transition: box-shadow 0.3s;
      -webkit-user-select: none;
      user-select: none;
      white-space: nowrap;
    }

    /* do not prevent click on slotted links */
    :host::before,
    :host::after {
      pointer-events: none;
    }

    :host::before {
      background-color: var(--material-primary-color);
      content: '';
      inset: 0;
      opacity: 0;
      position: absolute;
      transition: opacity 0.1s linear;
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
      background-color: var(--material-primary-color);
      border-radius: 50%;
      content: '';
      height: 100px;
      left: 50%;
      opacity: 0;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition:
        transform 0s cubic-bezier(0.05, 0.8, 0.5, 1),
        opacity 0s linear;
      width: 100px;
    }

    :host([focused]:not([focus-ring]))::after,
    :host([focused][active])::after,
    :host([focus-ring][selected])::after {
      opacity: 0;
      transform: translate(-50%, -50%) scale(3);
      transition-duration: 2s, 0.6s;
    }

    :host([active]:not([selected]))::after {
      opacity: 0.2;
      transition-duration: 2s, 0s;
    }

    /* Disabled */
    :host([disabled]) {
      color: var(--material-disabled-text-color);
      opacity: 1;
      pointer-events: none;
    }

    :host ::slotted(a) {
      align-items: center;
      color: inherit;
      display: flex;
      height: 100%;
      justify-content: center;
      margin: -12px -16px;
      outline: none;
      padding: 12px 16px;
      text-decoration: none;
      width: 100%;
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
