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
