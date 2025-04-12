import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const button = css`
  :host {
    display: inline-flex;
    box-sizing: border-box;
    flex-shrink: 0;
    align-items: baseline;
    justify-content: center;
    min-width: 64px;
    padding: 8px;
    overflow: hidden;
    transition: box-shadow 0.2s;
    border-radius: 4px;
    color: var(--material-primary-text-color);
    font-family: var(--material-font-family);
    font-size: var(--material-button-font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 500;
    letter-spacing: 0.05em;
    line-height: 20px;
    text-transform: uppercase;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }

  :host::before,
  :host::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    opacity: 0;
    background-color: currentColor;
    pointer-events: none;
  }

  :host::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.5s;
  }

  :host::after {
    top: 50%;
    left: 50%;
    width: 320px;
    height: 320px;
    transform: translate(-50%, -50%);
    transition: all 0.9s;
    border-radius: 50%;
  }

  [part='label'] ::slotted(*) {
    vertical-align: middle;
  }

  :host(:hover:not([disabled]))::before,
  :host([focus-ring])::before {
    transition-duration: 0.2s;
    opacity: 0.08;
  }

  :host([active])::before {
    transition: opacity 0.4s;
    opacity: 0.16;
  }

  :host([active])::after {
    transform: translate(-50%, -50%) scale(0.0000001); /* animation works weirdly with scale(0) */
    transition: 0s;
    opacity: 0.1;
  }

  :host(:hover:not([active]):not([disabled]))::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }

  :host([disabled]) {
    color: var(--material-disabled-text-color);
  }

  /* Contained and outline variants */
  :host([theme~='contained']),
  :host([theme~='outlined']) {
    padding: 8px 16px;
  }

  :host([theme~='outlined']) {
    box-shadow: inset 0 0 0 1px var(--_material-button-outline-color, rgba(0, 0, 0, 0.2));
  }

  :host([theme~='contained']:not([disabled])) {
    background-color: var(--material-primary-color);
    box-shadow: var(--material-shadow-elevation-2dp);
    color: var(--material-primary-contrast-color);
  }

  :host([theme~='contained'][disabled]) {
    background-color: var(--material-secondary-background-color);
  }

  :host([theme~='contained']:not([disabled]):hover) {
    box-shadow: var(--material-shadow-elevation-4dp);
  }

  :host([theme~='contained'][active]) {
    box-shadow: var(--material-shadow-elevation-8dp);
  }

  /* Icon alignment */

  [part] ::slotted(vaadin-icon) {
    display: block;
    width: 18px;
    height: 18px;
  }

  [part='prefix'] ::slotted(vaadin-icon) {
    margin-right: 8px;
    margin-left: -4px;
  }

  [part='suffix'] ::slotted(vaadin-icon) {
    margin-right: -4px;
    margin-left: 8px;
  }

  /* RTL specific styles */

  :host([dir='rtl'])::before {
    right: 0;
    left: auto;
  }

  :host([dir='rtl'])::after {
    right: 50%;
    left: auto;
    transform: translate(50%, -50%);
  }

  :host([active][dir='rtl'])::after {
    transform: translate(50%, -50%) scale(0.0000001);
  }

  :host(:hover:not([active]):not([disabled])[dir='rtl'])::after {
    transform: translate(50%, -50%) scale(1);
  }

  :host([dir='rtl']) [part='prefix'] ::slotted(vaadin-icon) {
    margin-right: -4px;
    margin-left: 8px;
  }

  :host([dir='rtl']) [part='suffix'] ::slotted(vaadin-icon) {
    margin-right: 8px;
    margin-left: -4px;
  }
`;

registerStyles('vaadin-button', button, { moduleId: 'material-button' });

export { button };
