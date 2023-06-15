import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavItemStyles = css`
  a {
    gap: var(--lumo-space-xs);
    padding: var(--lumo-space-s);
    padding-inline-start: calc(var(--lumo-space-s) + var(--_child-indent, 0px));
    border-radius: var(--lumo-border-radius-m);
    transition: background-color 140ms, color 140ms;
    cursor: var(--lumo-clickable-cursor, default);
    min-height: var(--lumo-icon-size-m);
  }

  button {
    border: 0;
    margin: calc((var(--lumo-icon-size-m) - var(--lumo-size-s)) / 2) 0;
    margin-inline-end: calc(var(--lumo-space-xs) * -1);
    padding: 0;
    background: transparent;
    font: inherit;
    color: var(--lumo-tertiary-text-color);
    width: var(--lumo-size-s);
    height: var(--lumo-size-s);
    cursor: var(--lumo-clickable-cursor, default);
    transition: color 140ms;
  }

  @media (any-hover: hover) {
    a:hover {
      color: var(--lumo-header-text-color);
    }

    button:hover {
      color: var(--lumo-body-text-color);
    }
  }

  a:active:focus {
    background-color: var(--lumo-contrast-5pct);
  }

  button::before {
    font-family: lumo-icons;
    content: var(--lumo-icons-dropdown);
    font-size: 1.5em;
    line-height: var(--lumo-size-s);
    display: inline-block;
    transform: rotate(-90deg);
    transition: transform 140ms;
  }

  :host([expanded]) button::before {
    transform: none;
  }

  @supports selector(:focus-visible) {
    a,
    button {
      outline: none;
    }

    a:focus-visible,
    button:focus-visible {
      border-radius: var(--lumo-border-radius-m);
      box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
    }
  }

  a:active {
    color: var(--lumo-header-text-color);
  }

  slot:not([name]) {
    margin: 0 var(--lumo-space-xs);
  }

  slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: var(--lumo-contrast-60pct);
  }

  :host([active]) slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: inherit;
  }

  slot[name='children'] {
    --_child-indent: calc(var(--_child-indent-2, 0px) + var(--vaadin-side-nav-child-indent, var(--lumo-space-l)));
  }

  slot[name='children']::slotted(*) {
    --_child-indent-2: var(--_child-indent);
  }

  :host([active]) a {
    color: var(--lumo-primary-text-color);
    background-color: var(--lumo-primary-color-10pct);
  }
`;

registerStyles('vaadin-side-nav-item', sideNavItemStyles, { moduleId: 'lumo-side-nav-item' });

export const sideNavStyles = css`
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    line-height: var(--lumo-line-height-xs);
    color: var(--lumo-body-text-color);
    -webkit-tap-highlight-color: transparent;
  }

  [part='label'] {
    display: flex;
    align-items: center;
    width: 100%;
    outline: none;
    box-sizing: border-box;
    border-radius: var(--lumo-border-radius-m);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-s);
    font-weight: 500;
    line-height: var(--lumo-line-height-xs);
  }

  [part='label'] ::slotted([slot='label']) {
    color: var(--lumo-secondary-text-color);
    margin: var(--lumo-space-s);
  }

  :host([focus-ring]) [part='label'] {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  [part='toggle'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--lumo-size-s);
    height: var(--lumo-size-s);
    margin-inline-start: auto;
    margin-inline-end: var(--lumo-space-xs);
    font-size: var(--lumo-icon-size-m);
    line-height: 1;
    color: var(--lumo-contrast-60pct);
    font-family: 'lumo-icons';
    cursor: var(--lumo-clickable-cursor);
  }

  [part='toggle']::before {
    content: var(--lumo-icons-angle-right);
  }

  :host(:not([collapsible])) [part='toggle'] {
    display: none !important;
  }

  :host(:not([collapsed])) [part='toggle'] {
    transform: rotate(90deg);
  }

  @media (any-hover: hover) {
    [part='label']:hover [part='toggle'] {
      color: var(--lumo-body-text-color);
    }
  }
`;

registerStyles('vaadin-side-nav', sideNavStyles, { moduleId: 'lumo-side-nav' });
