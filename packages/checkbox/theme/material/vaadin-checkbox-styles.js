import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-checkbox',
  css`
    :host {
      --_checkbox-size: var(--vaadin-checkbox-size, 16px);
      display: inline-block;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }

    [part='label'] {
      display: flex;
      max-width: max-content;
      position: relative;
    }

    :host([has-label]) ::slotted(label) {
      padding: 3px 12px 3px 6px;
    }

    [part='checkbox'] {
      background-color: transparent;
      border-radius: 2px;
      box-shadow: inset 0 0 0 2px var(--material-secondary-text-color);
      height: var(--_checkbox-size);
      margin: 4px;
      position: relative;
      width: var(--_checkbox-size);
    }

    /* Used for the ripple */
    [part='checkbox']::before {
      background-color: var(--material-disabled-text-color);
      border-radius: 50%;
      height: 100%;
      line-height: var(--_checkbox-size);
      opacity: 0;
      pointer-events: none;
      transform: scale(0);
      transition:
        transform 0s 0.8s,
        opacity 0.8s;
      width: 100%;
      will-change: transform, opacity;
    }

    /* Used for the checkmark */
    [part='checkbox']::after {
      border: 0 solid var(--material-background-color);
      border-width: 3px 0 0 3px;
      box-sizing: border-box;
      content: '';
      display: inline-block;
      height: 19px;
      left: 6px;
      pointer-events: none;
      position: absolute;
      top: 12px;
      transform: scale(0) rotate(-135deg);
      transform-origin: 0 0;
      transition: transform 0.2s;
      width: 10px;
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
      opacity: 0.15;
      transform: scale(2.5);
      transition-delay: 0s, 0s;
      transition-duration: 0.08s, 0.01s;
    }

    :host([checked]) [part='checkbox']::before {
      background-color: var(--material-primary-color);
    }

    :host([indeterminate]) [part='checkbox']::after {
      background-color: var(--material-background-color);
      border: 0;
      height: 10%;
      left: 22%;
      opacity: 1;
      right: 22%;
      top: 45%;
      transform: none;
      transition: opacity 0.4s;
      width: auto;
    }

    :host([disabled]) {
      color: var(--material-disabled-text-color);
      pointer-events: none;
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

    :host([readonly][checked]:not([disabled])) [part='checkbox'],
    :host([readonly][indeterminate]:not([disabled])) [part='checkbox'],
    :host([readonly]:not([disabled])) [part='checkbox']::before {
      background-color: var(--material-secondary-text-color);
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: 3px 6px 3px 12px;
    }

    /* Required */
    :host([required]) [part='required-indicator'] {
      position: absolute;
      right: 2px;
      top: 3px;
    }

    :host([dir='rtl'][required]) [part='required-indicator'] {
      left: 2px;
      right: auto;
    }

    :host([required]:not([disabled])) [part='required-indicator'] {
      color: var(--material-secondary-text-color);
    }

    :host([required]) [part='required-indicator']::after {
      content: '*';
    }

    :host([invalid]) [part='required-indicator']::after {
      color: var(--material-error-text-color);
    }

    :host(:not([has-label])) [part='required-indicator'] {
      display: none;
    }

    [part='error-message'],
    [part='helper-text'] {
      font-size: 0.75em;
      line-height: 1;
      padding-left: 6px;
    }

    [part='error-message'] {
      color: var(--material-error-text-color);
    }

    [part='helper-text'] {
      color: var(--material-secondary-text-color);
    }

    :host([has-error-message]) [part='error-message']::before,
    :host([has-helper]) [part='helper-text']::before {
      content: '';
      display: block;
      height: 6px;
    }
  `,
  { moduleId: 'material-checkbox' },
);
