import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';

registerStyles(
  '',
  css`
    :host {
      /* Sizing */
      --lumo-button-size: var(--lumo-size-m);
      min-width: calc(var(--lumo-button-size) * 2);
      height: var(--lumo-button-size);
      margin: var(--lumo-space-xs) 0;
      padding: 0 calc(var(--lumo-button-size) / 3 + var(--lumo-border-radius-m) / 2);
      box-sizing: border-box;
      /* Style */
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      font-weight: 500;
      /*
        By default, "line-height" is set to "normal", but it means that the real value may vary
        depending on the environment (platform, browser and etc).
        So it was considered to give line-height a fixed value here in order to avoid
        "1px alignment difference" issues in different browsers.

        See more: https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#values.
      */
      line-height: var(--lumo-line-height-xs);
      color: var(--_lumo-button-color, var(--lumo-primary-text-color));
      background-color: var(--_lumo-button-background-color, var(--lumo-contrast-5pct));
      border-radius: var(--lumo-border-radius-m);
      cursor: var(--lumo-clickable-cursor);
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([theme~='small']) {
      font-size: var(--lumo-font-size-s);
      --lumo-button-size: var(--lumo-size-s);
    }

    :host([theme~='large']) {
      font-size: var(--lumo-font-size-l);
      --lumo-button-size: var(--lumo-size-l);
    }

    /* This needs to be the last selector for it to take priority */
    :host([disabled][disabled]) {
      pointer-events: none;
      color: var(--lumo-disabled-text-color);
      background-color: var(--lumo-contrast-5pct);
    }

    /* For interaction states */
    :host [part='button']::before,
    :host [part='button']::after {
      content: '';
      /* We rely on the host always being relative */
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: currentColor;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }

    /* Hover */

    :host(:hover) [part='button']::before {
      opacity: 0.05;
    }

    /* Disable hover for touch devices */
    @media (pointer: coarse) {
      :host(:not([active]):hover) [part='button']::before {
        opacity: 0;
      }
    }

    /* Active */

    :host [part='button']::after {
      transition: opacity 1.4s, transform 0.1s;
      filter: blur(8px);
    }

    :host([active]) [part='button']::before {
      opacity: 0.1;
      transition-duration: 0s;
    }

    :host([active]) [part='button']::after {
      opacity: 0.1;
      transition-duration: 0s, 0s;
      transform: scale(0);
    }

    /* Keyboard focus */

    :host([focus-ring]) {
      box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    /* Types (primary, tertiary, tertiary-inline */

    :host([theme~='tertiary']),
    :host([theme~='tertiary-inline']) {
      background-color: transparent !important;
      transition: opacity 0.2s;
      min-width: 0;
    }

    :host([theme~='tertiary']) [part='button']::before,
    :host([theme~='tertiary-inline']) [part='button']::before {
      display: none;
    }

    :host([theme~='tertiary']) {
      padding: 0 calc(var(--lumo-button-size) / 6);
    }

    @media (hover: hover) {
      :host([theme*='tertiary']:not([active]):hover) {
        opacity: 0.8;
      }
    }

    :host([theme~='tertiary'][active]),
    :host([theme~='tertiary-inline'][active]) {
      opacity: 0.5;
      transition-duration: 0s;
    }

    :host([theme~='tertiary-inline']) {
      margin: 0;
      height: auto;
      line-height: inherit;
      font-size: inherit;
    }

    :host([theme~='tertiary-inline']) {
      padding: 0;
    }

    :host([theme~='tertiary-inline']) slot:not([name]) {
      padding: 0;
      overflow: visible;
      line-height: inherit;
    }

    :host([theme~='primary']) {
      background-color: var(--_lumo-button-primary-background-color, var(--lumo-primary-color));
      color: var(--_lumo-button-primary-color, var(--lumo-primary-contrast-color));
      font-weight: 600;
      min-width: calc(var(--lumo-button-size) * 2.5);
    }

    :host([theme~='primary'][disabled]) {
      background-color: var(--lumo-primary-color-50pct);
      color: var(--lumo-primary-contrast-color);
    }

    :host([theme~='primary']:hover) [part='button']::before {
      opacity: 0.1;
    }

    :host([theme~='primary'][active]) [part='button']::before {
      background-color: var(--lumo-shade-20pct);
    }

    @media (pointer: coarse) {
      :host([theme~='primary'][active]) [part='button']::before {
        background-color: var(--lumo-shade-60pct);
      }

      :host([theme~='primary']:not([active]):hover) [part='button']::before {
        opacity: 0;
      }
    }

    :host([theme~='primary'][active]) [part='button']::after {
      opacity: 0.2;
    }

    /* Colors (success, error, contrast) */

    :host([theme~='success']) {
      color: var(--lumo-success-text-color);
    }

    :host([theme~='success'][theme~='primary']) {
      background-color: var(--lumo-success-color);
      color: var(--lumo-success-contrast-color);
    }

    :host([theme~='success'][theme~='primary'][disabled]) {
      background-color: var(--lumo-success-color-50pct);
    }

    :host([theme~='error']) {
      color: var(--lumo-error-text-color);
    }

    :host([theme~='error'][theme~='primary']) {
      background-color: var(--lumo-error-color);
      color: var(--lumo-error-contrast-color);
    }

    :host([theme~='error'][theme~='primary'][disabled]) {
      background-color: var(--lumo-error-color-50pct);
    }

    :host([theme~='contrast']) {
      color: var(--lumo-contrast);
    }

    :host([theme~='contrast'][theme~='primary']) {
      background-color: var(--lumo-contrast);
      color: var(--lumo-base-color);
    }

    :host([theme~='contrast'][theme~='primary'][disabled]) {
      background-color: var(--lumo-contrast-50pct);
    }

    /* Icons */

    ::slotted(vaadin-icon),
    ::slotted(iron-icon) {
      display: inline-block;
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }

    /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
    ::slotted(vaadin-icon[icon^='vaadin:']),
    ::slotted(iron-icon[icon^='vaadin:']) {
      padding: 0.25em;
      box-sizing: border-box !important;
    }

    slot[name='prefix']::slotted(*) {
      margin-left: -0.25em;
      margin-right: 0.25em;
    }

    slot[name='suffix']::slotted(*) {
      margin-left: 0.25em;
      margin-right: -0.25em;
    }

    /* Icon-only */

    :host([theme~='icon']:not([theme~='tertiary-inline'])) {
      min-width: var(--lumo-button-size);
      padding-left: calc(var(--lumo-button-size) / 4);
      padding-right: calc(var(--lumo-button-size) / 4);
    }

    :host([theme~='icon']) slot[name='prefix']::slotted(*),
    :host([theme~='icon']) slot[name='suffix']::slotted(*) {
      margin-left: 0;
      margin-right: 0;
    }

    /* RTL specific styles */

    :host([dir='rtl']) slot[name='prefix']::slotted(*) {
      margin-left: 0.25em;
      margin-right: -0.25em;
    }

    :host([dir='rtl']) slot[name='suffix']::slotted(*) {
      margin-left: -0.25em;
      margin-right: 0.25em;
    }

    :host([dir='rtl'][theme~='icon']) slot[name='prefix']::slotted(*),
    :host([dir='rtl'][theme~='icon']) slot[name='suffix']::slotted(*) {
      margin-left: 0;
      margin-right: 0;
    }
  `,
  { moduleId: 'lumo-button-styles' }
);
