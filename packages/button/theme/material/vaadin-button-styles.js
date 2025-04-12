import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const button = css`
  :host {
    display: inline-flex;
    overflow: hidden;
    min-width: 64px;
    box-sizing: border-box;
    flex-shrink: 0;
    align-items: baseline;
    justify-content: center;
    padding: 8px;
    border-radius: 4px;
    color: var(--material-primary-text-color);
    font-family: var(--material-font-family);
    font-size: var(--material-button-font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 500;
    letter-spacing: 0.05em;
    line-height: 20px;
    -webkit-tap-highlight-color: transparent;
    text-transform: uppercase;
    transition: box-shadow 0.2s;
    white-space: nowrap;
  }

  :host::before,
  :host::after {
    position: absolute;
    border-radius: inherit;
    background-color: currentColor;
    content: '';
    opacity: 0;
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
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.9s;
  }

  [part='label'] ::slotted(*) {
    vertical-align: middle;
  }

  :host(:hover:not([disabled]))::before,
  :host([focus-ring])::before {
    opacity: 0.08;
    transition-duration: 0.2s;
  }

  :host([active])::before {
    opacity: 0.16;
    transition: opacity 0.4s;
  }

  :host([active])::after {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(0.0000001); /* animation works weirdly with scale(0) */
    transition: 0s;
  }

  :host(:hover:not([active]):not([disabled]))::after {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
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
