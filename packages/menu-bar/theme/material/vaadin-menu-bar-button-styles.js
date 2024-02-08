import { button } from '@vaadin/button/theme/material/vaadin-button-styles';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarButton = css`
  [part='label'] {
    width: 100%;
  }

  [part='label'] ::slotted(vaadin-menu-bar-item) {
    line-height: 20px;
    background-color: transparent;
    margin: -8px;
    padding: 8px;
    justify-content: center;
  }

  :host([theme~='outlined']),
  :host([theme~='contained']) {
    border-radius: 0;
  }

  :host([theme~='contained']) ::slotted(vaadin-menu-bar-item),
  :host([theme~='outlined']) ::slotted(vaadin-menu-bar-item) {
    margin: -8px -16px;
    padding: 8px 16px;
  }

  :host([expanded])::before {
    opacity: 0.08;
    transition: opacity 0.4s;
  }

  :host([expanded])::after {
    transform: translate(-50%, -50%) scale(0.0000001); /* animation works weirdly with scale(0) */
    opacity: 0.1;
    transition: 0s;
  }

  :host([theme~='contained'][expanded]) {
    box-shadow: var(--material-shadow-elevation-8dp);
  }

  :host(:hover:not([expanded]))::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }

  :host([theme~='contained']:not([dir='rtl'])) {
    margin-right: 1px;
  }

  :host([first-visible]) {
    border-radius: 4px 0 0 4px;
  }

  :host([last-visible]),
  :host([slot='overflow']) {
    border-radius: 0 4px 4px 0;
  }

  :host([slot='overflow']) {
    padding-right: 8px;
    padding-left: 8px;
    min-width: 36px;
  }

  :host([slot='overflow']) ::slotted(*) {
    font-size: 24px;
  }

  :host([theme~='outlined']:not([dir='rtl'])) {
    margin-right: -1px;
  }

  :host([theme~='outlined']:not([dir='rtl'])[last-visible]),
  :host([theme~='outlined']:not([dir='rtl'])[slot='overflow']) {
    margin-right: 0;
  }

  :host([theme~='text']),
  :host(:not([theme])) {
    border-radius: 4px;
  }

  /* RTL styles */
  :host([dir='rtl'][first-visible]) {
    border-radius: 0 4px 4px 0;
  }

  :host([dir='rtl'][last-visible]),
  :host([dir='rtl'][slot='overflow']) {
    border-radius: 4px 0 0 4px;
  }

  :host([dir='rtl'][theme~='contained']) {
    margin-left: 1px;
  }

  :host([dir='rtl'][theme~='outlined']) {
    margin-left: -1px;
  }

  :host([theme~='outlined'][dir='rtl'][last-visible]),
  :host([theme~='outlined'][dir='rtl'][slot='overflow']) {
    margin-left: 0;
  }
`;

registerStyles('vaadin-menu-bar-button', [button, menuBarButton], {
  moduleId: 'material-menu-bar-button',
});
