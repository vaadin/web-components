import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';

registerStyles(
  'vaadin-checkbox',
  css`
    :host {
      display: inline-block;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([has-label]) ::slotted(label) {
      padding: 3px 12px 3px 6px;
    }

    [part='checkbox'] {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin: 4px;
      position: relative;
      border-radius: 2px;
      box-shadow: inset 0 0 0 2px var(--material-secondary-text-color);
      line-height: 1.275;
      background-color: transparent;
    }

    /* Used for the ripple */
    [part='checkbox']::before {
      /* Needed to align the checkbox nicely on the baseline */
      content: '\\2003';
      pointer-events: none;
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: var(--material-disabled-text-color);
      transform: scale(0);
      opacity: 0;
      transition: transform 0s 0.8s, opacity 0.8s;
      will-change: transform, opacity;
    }

    /* Used for the checkmark */
    [part='checkbox']::after {
      content: '';
      pointer-events: none;
      display: inline-block;
      width: 10px;
      height: 19px;
      border: 0 solid var(--material-background-color);
      border-width: 3px 0 0 3px;
      box-sizing: border-box;
      transform-origin: 0 0;
      position: absolute;
      top: 12px;
      left: 6px;
      transform: scale(0) rotate(-135deg);
      transition: transform 0.2s;
    }

    :host([indeterminate]) [part='checkbox'],
    :host([checked]) [part='checkbox'] {
      background-color: var(--material-primary-color);
      box-shadow: none;
    }

    :host([checked]) [part='checkbox']::after {
      transform: scale(0.55) rotate(-135deg);
    }

    :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
      background-color: transparent;
    }

    :host([focus-ring]) [part='checkbox']::before,
    :host([active]) [part='checkbox']::before {
      transition-duration: 0.08s, 0.01s;
      transition-delay: 0s, 0s;
      transform: scale(2.5);
      opacity: 0.15;
    }

    :host([checked]) [part='checkbox']::before {
      background-color: var(--material-primary-color);
    }

    :host([indeterminate]) [part='checkbox']::after {
      transform: none;
      opacity: 1;
      top: 45%;
      height: 10%;
      left: 22%;
      right: 22%;
      width: auto;
      border: 0;
      background-color: var(--material-background-color);
      transition: opacity 0.4s;
    }

    :host([disabled]) {
      pointer-events: none;
      color: var(--material-disabled-text-color);
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]:not([checked]):not([indeterminate])) [part='checkbox'] {
      box-shadow: inset 0 0 0 2px var(--material-disabled-color);
    }

    :host([disabled][checked]) [part='checkbox'],
    :host([disabled][indeterminate]) [part='checkbox'] {
      background-color: var(--material-disabled-color);
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: 3px 6px 3px 12px;
    }
  `,
  { moduleId: 'material-checkbox' }
);
