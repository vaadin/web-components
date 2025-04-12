import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-radio-button',
  css`
    :host {
      --_radio-button-size: var(--vaadin-radio-button-size, 16px);
      display: inline-block;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }

    :host([has-label]) ::slotted(label) {
      padding: 4px 0.875em 4px 0.375em;
    }

    [part='radio'] {
      position: relative;
      width: var(--_radio-button-size);
      height: var(--_radio-button-size);
      border: 2px solid;
      border-radius: 50%;
      margin: 4px;
      background-color: transparent;
      transition:
        transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2),
        background-color 0.15s;
      will-change: transform;
    }

    /* Used for activation "halo" */
    [part='radio']::before {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background-color: var(--material-primary-color);
      color: transparent;
      line-height: var(--_radio-button-size);
      opacity: 0;
      pointer-events: none;
      transform: scale(2.5);
      transition:
        transform 0.1s,
        opacity 0.8s;
    }

    :host([checked]) [part='radio'] {
      border-color: var(--material-primary-color);
    }

    /* Used for the selection dot */
    [part='radio']::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--material-primary-color);
      content: '';
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.2s;
    }

    :host([checked]) [part='radio']::after {
      transform: translate(-50%, -50%) scale(1);
    }

    :host(:not([checked]):not([disabled])) [part='radio'] {
      border-color: var(--material-secondary-text-color);
    }

    :host([active][checked]) [part='radio']::before,
    :host([active]:not([checked])) [part='radio']::before {
      opacity: 0.2;
      transform: scale(0);
      transition-duration: 0.01s, 0.01s;
    }

    :host([focus-ring]) [part='radio']::before {
      opacity: 0.15;
      transform: scale(2.5);
      transition-duration: 0s;
    }

    :host([disabled]) {
      color: var(--material-disabled-text-color);
      pointer-events: none;
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]) [part='radio'] {
      border-color: var(--material-disabled-color);
    }

    :host([disabled]) [part='radio']::after {
      background-color: var(--material-disabled-color);
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: 4px 0.375em 4px 0.875em;
    }
  `,
  { moduleId: 'material-radio-button' },
);
