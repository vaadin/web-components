import { button } from '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarButton = css`
  :host {
    border-radius: 0;
    margin: calc(var(--lumo-space-xs) / 2);
    margin-left: 0;
  }

  [part='label'] {
    width: 100%;
  }

  /* NOTE(web-padawan): avoid using shorthand padding property for IE11 */
  [part='label'] ::slotted(vaadin-menu-bar-item) {
    height: var(--lumo-button-size);
    justify-content: center;
    padding-right: calc(var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2);
    padding-left: calc(var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2);
    margin: 0 calc((var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2) * -1);
    background-color: transparent;
  }

  :host([theme~='small']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    min-height: var(--lumo-size-s);
    padding-right: calc(var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2);
    padding-left: calc(var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2);
    margin: 0 calc((var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2) * -1);
  }

  :host([theme~='tertiary']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    padding-right: calc(var(--lumo-button-size) / 6);
    padding-left: calc(var(--lumo-button-size) / 6);
    margin: 0 calc((var(--lumo-button-size) / 6) * -1);
  }

  :host([theme~='tertiary-inline']) {
    margin-top: calc(var(--lumo-space-xs) / 2);
    margin-right: calc(var(--lumo-space-xs) / 2);
    margin-bottom: calc(var(--lumo-space-xs) / 2);
  }

  :host([theme~='tertiary-inline']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    padding: 0;
    margin: 0;
  }

  :host([first-visible]) {
    border-radius: var(--lumo-border-radius-m) 0 0 var(--lumo-border-radius-m);

    /* Needed to retain the focus-ring with border-radius */
    margin-left: calc(var(--lumo-space-xs) / 2);
  }

  :host([last-visible]),
  :host([slot='overflow']) {
    border-radius: 0 var(--lumo-border-radius-m) var(--lumo-border-radius-m) 0;
  }

  :host([theme~='tertiary']),
  :host([theme~='tertiary-inline']) {
    border-radius: var(--lumo-border-radius-m);
  }

  :host([slot='overflow']) {
    min-width: var(--lumo-button-size);
    padding-right: calc(var(--lumo-button-size) / 4);
    padding-left: calc(var(--lumo-button-size) / 4);
  }

  :host([slot='overflow']) ::slotted(*) {
    font-size: var(--lumo-font-size-xl);
  }

  :host([slot='overflow']) [part='prefix'],
  :host([slot='overflow']) [part='suffix'] {
    margin-right: 0;
    margin-left: 0;
  }

  :host([theme~='dropdown-indicators']:not([slot='overflow']):not([theme~='icon'])[aria-haspopup]) [part='suffix'] {
    position: relative;
    width: 1em;
    height: 1em;
    font-size: var(--lumo-icon-size-s);
    inset-inline-start: 0.15em;
    line-height: 1;
    margin-inline-start: 0;
  }

  /* prettier-ignore */
  :host([theme~='dropdown-indicators']:not([slot='overflow']):not([theme~='icon'])[aria-haspopup]) [part='suffix']::after {
    content: var(--lumo-icons-dropdown);
    font-family: lumo-icons;
  }

  /* prettier-ignore */
  :host([theme~='dropdown-indicators']:not([slot='overflow']):not([theme~='icon'])[theme~='tertiary'][aria-haspopup]) [part='suffix'] {
    inset-inline-start: 0.05em;
  }

  /* prettier-ignore */
  :host([theme~='dropdown-indicators']:not([slot='overflow']):not([theme~='icon'])[theme~='tertiary-inline'][aria-haspopup]) [part='suffix'] {
    inset-inline-start: 0;
  }

  /* RTL styles */
  :host([dir='rtl']) {
    border-radius: 0;
    margin-right: 0;
    margin-left: calc(var(--lumo-space-xs) / 2);
  }

  :host([dir='rtl'][first-visible]) {
    border-radius: 0 var(--lumo-border-radius-m) var(--lumo-border-radius-m) 0;
    margin-right: calc(var(--lumo-space-xs) / 2);
  }

  :host([dir='rtl'][last-visible]),
  :host([dir='rtl'][slot='overflow']) {
    border-radius: var(--lumo-border-radius-m) 0 0 var(--lumo-border-radius-m);
  }
`;

registerStyles('vaadin-menu-bar-button', [button, menuBarButton], {
  moduleId: 'lumo-menu-bar-button',
});
