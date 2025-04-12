import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tab',
  css`
    :host {
      --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
      --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
      --_selection-color: var(--vaadin-selection-color, var(--lumo-primary-color));
      --_selection-color-text: var(--vaadin-selection-color-text, var(--lumo-primary-text-color));
      align-items: center;
      box-sizing: border-box;
      color: var(--lumo-secondary-text-color);
      cursor: var(--lumo-clickable-cursor);
      display: flex;
      flex-shrink: 0;
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 500;
      line-height: var(--lumo-line-height-xs);
      min-width: var(--lumo-size-m);
      opacity: 1;
      outline: none;
      overflow: hidden;
      padding: 0.5rem 0.75rem;
      position: relative;
      transform-origin: 50% 100%;
      transition:
        0.15s color,
        0.2s transform;
      -webkit-user-select: none;
      user-select: none;
    }

    :host(:not([orientation='vertical'])) {
      text-align: center;
    }

    :host([orientation='vertical']) {
      min-height: var(--lumo-size-m);
      min-width: 0;
      padding: 0.25rem 1rem;
      transform-origin: 0% 50%;
    }

    @media (forced-colors: active) {
      :host([focused]) {
        outline: 1px solid;
        outline-offset: -1px;
      }

      :host([orientation='vertical'][selected]) {
        border-bottom: none;
        border-left: 2px solid;
      }
    }

    :host(:hover),
    :host([focus-ring]) {
      color: var(--lumo-body-text-color);
    }

    :host([selected]) {
      color: var(--_selection-color-text);
      transition: 0.6s color;
    }

    :host([active]:not([selected])) {
      color: var(--_selection-color-text);
      transition-duration: 0.1s;
    }

    :host::before,
    :host::after {
      background-color: var(--lumo-contrast-60pct);
      border-radius: var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0 0;
      bottom: 0;
      content: '';
      display: var(--_lumo-tab-marker-display, block);
      height: 2px;
      left: 50%;
      position: absolute;
      transform: translateX(-50%) scale(0);
      transform-origin: 50% 100%;
      transition: 0.14s transform cubic-bezier(0.12, 0.32, 0.54, 1);
      width: var(--lumo-size-s);
      will-change: transform;
    }

    :host([orientation='vertical'])::before,
    :host([orientation='vertical'])::after {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
      bottom: 50%;
      height: var(--lumo-size-xs);
      left: 0;
      transform: translateY(50%) scale(0);
      transform-origin: 100% 50%;
      width: 2px;
    }

    :host::after {
      box-shadow: 0 0 0 4px var(--_selection-color);
      opacity: 0.15;
      transition:
        0.15s 0.02s transform,
        0.8s 0.17s opacity;
    }

    :host([selected])::before,
    :host([selected])::after {
      background-color: var(--_selection-color);
      transform: translateX(-50%) scale(1);
      transition-timing-function: cubic-bezier(0.12, 0.32, 0.54, 1.5);
    }

    :host([orientation='vertical'][selected])::before,
    :host([orientation='vertical'][selected])::after {
      transform: translateY(50%) scale(1);
    }

    :host([selected]:not([active]))::after {
      opacity: 0;
    }

    :host(:not([orientation='vertical'])) ::slotted(a[href]) {
      justify-content: center;
    }

    :host ::slotted(a) {
      align-items: center;
      color: inherit !important;
      display: flex;
      height: 100%;
      margin: -0.5rem -0.75rem;
      outline: none;
      padding: 0.5rem 0.75rem;

      /*
  Override the CSS inherited from \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\`lumo-color\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\` and \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\`lumo-typography\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\`.
  Note: \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\`!important\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\` is needed because of the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\`:slotted\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\` specificity.
*/
      text-decoration: none !important;
      width: 100%;
    }

    :host ::slotted(vaadin-icon) {
      height: var(--lumo-icon-size-m);
      margin: 0 4px;
      width: var(--lumo-icon-size-m);
    }

    /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
    :host ::slotted(vaadin-icon[icon^='vaadin:']) {
      box-sizing: border-box !important;
      padding: 0.25rem;
    }

    :host(:not([dir='rtl'])) ::slotted(vaadin-icon:first-child) {
      margin-left: 0;
    }

    :host(:not([dir='rtl'])) ::slotted(vaadin-icon:last-child) {
      margin-right: 0;
    }

    :host([theme~='icon-on-top']) {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding-bottom: 0.5rem;
      padding-top: 0.25rem;
      text-align: center;
    }

    :host([theme~='icon-on-top']) ::slotted(a) {
      align-items: center;
      flex-direction: column;
      margin-top: -0.25rem;
      padding-top: 0.25rem;
    }

    :host([theme~='icon-on-top']) ::slotted(vaadin-icon) {
      margin: 0;
    }

    /* Disabled */

    :host([disabled]) {
      color: var(--lumo-disabled-text-color);
      opacity: 1;
      pointer-events: none;
    }

    /* Focus-ring */

    :host([focus-ring]) {
      border-radius: var(--lumo-border-radius-m);
      box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
    }

    /* RTL specific styles */

    :host([dir='rtl'])::before,
    :host([dir='rtl'])::after {
      left: auto;
      right: 50%;
      transform: translateX(50%) scale(0);
    }

    :host([dir='rtl'][selected]:not([orientation='vertical']))::before,
    :host([dir='rtl'][selected]:not([orientation='vertical']))::after {
      transform: translateX(50%) scale(1);
    }

    :host([dir='rtl']) ::slotted(vaadin-icon:first-child) {
      margin-right: 0;
    }

    :host([dir='rtl']) ::slotted(vaadin-icon:last-child) {
      margin-left: 0;
    }

    :host([orientation='vertical'][dir='rtl']) {
      transform-origin: 100% 50%;
    }

    :host([dir='rtl'][orientation='vertical'])::before,
    :host([dir='rtl'][orientation='vertical'])::after {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
      left: auto;
      right: 0;
      transform-origin: 0% 50%;
    }
  `,
  { moduleId: 'lumo-tab' },
);
