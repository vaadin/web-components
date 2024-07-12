import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavItemStyles = css`
  :host {
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
  }

  [part='link'] {
    width: 100%;
    gap: var(--lumo-space-xs);
    padding: var(--lumo-space-s);
    padding-inline-start: calc(var(--lumo-space-s) + var(--_child-indent, 0px));
    border-radius: var(--lumo-border-radius-m);
    transition:
      background-color 140ms,
      color 140ms;
    cursor: var(--lumo-clickable-cursor, default);
    min-height: var(--lumo-icon-size-m);
  }

  [part='link'][href] {
    cursor: pointer;
  }

  :host([disabled]) [part='link'] {
    color: var(--lumo-disabled-text-color);
  }

  [part='toggle-button'] {
    margin-inline-end: calc(var(--lumo-space-xs) * -1);
    width: var(--lumo-size-s);
    height: var(--lumo-size-s);
  }

  :host([has-children]) [part='content'] {
    padding-inline-end: var(--lumo-space-s);
  }

  @media (any-hover: hover) {
    [part='link']:hover {
      color: var(--lumo-header-text-color);
    }

    [part='toggle-button']:hover {
      color: var(--lumo-body-text-color);
    }
  }

  [part='link']:active:focus {
    background-color: var(--lumo-contrast-5pct);
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
    transform: rotate(-90deg);
    transition: transform 140ms;
  }

  :host([dir='rtl']) [part='toggle-button']::before {
    transform: rotate(90deg);
  }

  :host([expanded]) [part='toggle-button']::before {
    transform: none;
  }

  @supports selector(:focus-visible) {
    [part='link'],
    [part='toggle-button'] {
      outline: none;
    }

    [part='link']:focus-visible,
    [part='toggle-button']:focus-visible {
      border-radius: var(--lumo-border-radius-m);
      box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
    }
  }

  [part='link']:active {
    color: var(--lumo-header-text-color);
  }

  slot:not([name]) {
    margin: 0 var(--lumo-space-s);
  }

  slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    padding: 0.1em;
    flex-shrink: 0;
    color: var(--lumo-contrast-60pct);
  }

  :host([disabled]) slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: var(--lumo-disabled-text-color);
  }

  :host([current]) slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: inherit;
  }

  slot[name='children'] {
    --_child-indent: calc(var(--_child-indent-2, 0px) + var(--vaadin-side-nav-child-indent, var(--lumo-space-l)));
  }

  slot[name='children']::slotted(*) {
    --_child-indent-2: var(--_child-indent);
  }

  :host([current]) [part='content'] {
    background-color: var(--lumo-primary-color-10pct);
    color: var(--vaadin-selection-color-text, var(--lumo-primary-text-color));
    border-radius: var(--lumo-border-radius-m);
  }
`;

registerStyles('vaadin-side-nav-item', [fieldButton, sideNavItemStyles], { moduleId: 'lumo-side-nav-item' });
