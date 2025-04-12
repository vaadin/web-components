import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const button = css`
  :host {
    align-items: baseline;
    border-radius: 4px;
    box-sizing: border-box;
    color: var(--material-primary-text-color);
    display: inline-flex;
    flex-shrink: 0;
    font-family: var(--material-font-family);
    font-size: var(--material-button-font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 500;
    justify-content: center;
    letter-spacing: 0.05em;
    line-height: 20px;
    min-width: 64px;
    overflow: hidden;
    padding: 8px;
    -webkit-tap-highlight-color: transparent;
    text-transform: uppercase;
    transition: box-shadow 0.2s;
    white-space: nowrap;
  }

  :host::before,
  :host::after {
    background-color: currentColor;
    border-radius: inherit;
    content: '';
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }

  :host::before {
    height: 100%;
    left: 0;
    top: 0;
    transition: opacity 0.5s;
    width: 100%;
  }

  :host::after {
    border-radius: 50%;
    height: 320px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.9s;
    width: 320px;
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
    height: 18px;
    width: 18px;
  }

  [part='prefix'] ::slotted(vaadin-icon) {
    margin-left: -4px;
    margin-right: 8px;
  }

  [part='suffix'] ::slotted(vaadin-icon) {
    margin-left: 8px;
    margin-right: -4px;
  }

  /* RTL specific styles */

  :host([dir='rtl'])::before {
    left: auto;
    right: 0;
  }

  :host([dir='rtl'])::after {
    left: auto;
    right: 50%;
    transform: translate(50%, -50%);
  }

  :host([active][dir='rtl'])::after {
    transform: translate(50%, -50%) scale(0.0000001);
  }

  :host(:hover:not([active]):not([disabled])[dir='rtl'])::after {
    transform: translate(50%, -50%) scale(1);
  }

  :host([dir='rtl']) [part='prefix'] ::slotted(vaadin-icon) {
    margin-left: 8px;
    margin-right: -4px;
  }

  :host([dir='rtl']) [part='suffix'] ::slotted(vaadin-icon) {
    margin-left: -4px;
    margin-right: 8px;
  }
`;

registerStyles('vaadin-button', button, { moduleId: 'material-button' });

export { button };
