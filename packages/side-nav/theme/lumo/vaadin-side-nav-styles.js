import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavItemStyles = css`
  :host {
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  a {
    flex: auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--lumo-space-xs);
    text-decoration: none;
    color: inherit;
    font: inherit;
    padding: var(--lumo-space-s);
    padding-inline-start: calc(var(--lumo-space-s) + var(--_child-indent, 0px));
    border-radius: var(--lumo-border-radius-m);
    transition: background-color 140ms, color 140ms;
    cursor: var(--lumo-clickable-cursor, default);
    min-height: var(--lumo-icon-size-m);
  }

  button {
    -webkit-appearance: none;
    appearance: none;
    border: 0;
    margin: calc((var(--lumo-icon-size-m) - var(--lumo-size-s)) / 2) 0;
    margin-inline-end: calc(var(--lumo-space-xs) * -1);
    padding: 0;
    background: transparent;
    font: inherit;
    color: var(--lumo-tertiary-text-color);
    flex: none;
    width: var(--lumo-size-s);
    height: var(--lumo-size-s);
    cursor: var(--lumo-clickable-cursor, default);
    transition: color 140ms;
  }

  :host(:not([path])) a {
    position: relative;
  }

  :host(:not([path])) button::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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

  slot[name='prefix'],
  slot[name='suffix'] {
    flex: none;
  }

  slot:not([name]) {
    display: block;
    flex: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  slot[name='children'] {
    /* Needed to make role="list" work */
    display: block;
    width: 100%;
  }

  :host([active]) a {
    color: var(--lumo-primary-text-color);
    background-color: var(--lumo-primary-color-10pct);
  }
`;

registerStyles('vaadin-side-nav-item', sideNavItemStyles, { moduleId: 'lumo-side-nav-item' });

export const sideNavStyles = css`
  :host {
    display: block;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    line-height: var(--lumo-line-height-xs);
    color: var(--lumo-body-text-color);
    -webkit-tap-highlight-color: transparent;
  }

  [hidden] {
    display: none !important;
  }

  summary {
    cursor: var(--lumo-clickable-cursor, default);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: var(--lumo-border-radius-m);
  }

  summary ::slotted([slot='label']) {
    display: block;
    font-size: var(--lumo-font-size-s);
    color: var(--lumo-secondary-text-color);
    margin: var(--lumo-space-s);
    border-radius: inherit;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::marker {
    content: '';
  }

  summary::after {
    font-family: lumo-icons;
    color: var(--lumo-tertiary-text-color);
    font-size: var(--lumo-icon-size-m);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--lumo-size-s);
    height: var(--lumo-size-s);
    transition: transform 140ms;
    margin: 0 var(--lumo-space-xs);
  }

  :host([collapsible]) summary::after {
    content: var(--lumo-icons-dropdown);
  }

  @media (any-hover: hover) {
    summary:hover::after {
      color: var(--lumo-body-text-color);
    }
  }

  :host([collapsed]) summary::after {
    transform: rotate(-90deg);
  }

  @supports selector(:focus-visible) {
    summary {
      outline: none;
    }

    summary:focus-visible {
      box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
    }
  }

  slot {
    /* Needed to make role="list" work */
    display: block;
  }
`;

registerStyles('vaadin-side-nav', sideNavStyles, { moduleId: 'lumo-side-nav' });
