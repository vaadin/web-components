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
      display: flex;
      position: relative;
      box-sizing: border-box;
      flex-shrink: 0;
      align-items: center;
      min-width: var(--lumo-size-m);
      padding: 0.5rem 0.75rem;
      overflow: hidden;
      transform-origin: 50% 100%;
      transition:
        0.15s color,
        0.2s transform;
      outline: none;
      opacity: 1;
      color: var(--lumo-secondary-text-color);
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 500;
      line-height: var(--lumo-line-height-xs);
      cursor: var(--lumo-clickable-cursor);
      -webkit-user-select: none;
      user-select: none;
    }

    :host(:not([orientation='vertical'])) {
      text-align: center;
    }

    :host([orientation='vertical']) {
      min-width: 0;
      min-height: var(--lumo-size-m);
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
      transition: 0.6s color;
      color: var(--_selection-color-text);
    }

    :host([active]:not([selected])) {
      transition-duration: 0.1s;
      color: var(--_selection-color-text);
    }

    :host::before,
    :host::after {
      content: '';
      display: var(--_lumo-tab-marker-display, block);
      position: absolute;
      bottom: 0;
      left: 50%;
      width: var(--lumo-size-s);
      height: 2px;
      transform: translateX(-50%) scale(0);
      transform-origin: 50% 100%;
      transition: 0.14s transform cubic-bezier(0.12, 0.32, 0.54, 1);
      border-radius: var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0 0;
      background-color: var(--lumo-contrast-60pct);
      will-change: transform;
    }

    :host([orientation='vertical'])::before,
    :host([orientation='vertical'])::after {
      bottom: 50%;
      left: 0;
      width: 2px;
      height: var(--lumo-size-xs);
      transform: translateY(50%) scale(0);
      transform-origin: 100% 50%;
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    :host::after {
      transition:
        0.15s 0.02s transform,
        0.8s 0.17s opacity;
      opacity: 0.15;
      box-shadow: 0 0 0 4px var(--_selection-color);
    }

    :host([selected])::before,
    :host([selected])::after {
      transform: translateX(-50%) scale(1);
      transition-timing-function: cubic-bezier(0.12, 0.32, 0.54, 1.5);
      background-color: var(--_selection-color);
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
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      margin: -0.5rem -0.75rem;
      padding: 0.5rem 0.75rem;
      outline: none;
      color: inherit !important;

      /*
      Override the CSS inherited from \\\\\\\`lumo-color\\\\\\\` and \\\\\\\`lumo-typography\\\\\\\`.
      Note: \\\\\\\`!important\\\\\\\` is needed because of the \\\\\\\`:slotted\\\\\\\` specificity.
    */
      text-decoration: none !important;
    }

    :host ::slotted(vaadin-icon) {
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
      margin: 0 4px;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      padding-top: 0.25rem;
      padding-bottom: 0.5rem;
      text-align: center;
    }

    :host([theme~='icon-on-top']) ::slotted(a) {
      flex-direction: column;
      align-items: center;
      margin-top: -0.25rem;
      padding-top: 0.25rem;
    }

    :host([theme~='icon-on-top']) ::slotted(vaadin-icon) {
      margin: 0;
    }

    /* Disabled */

    :host([disabled]) {
      opacity: 1;
      color: var(--lumo-disabled-text-color);
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
      right: 50%;
      left: auto;
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
      right: 0;
      left: auto;
      transform-origin: 0% 50%;
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }
  `,
  { moduleId: 'lumo-tab' },
);
