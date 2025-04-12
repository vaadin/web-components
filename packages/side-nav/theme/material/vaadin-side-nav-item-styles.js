import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavItemStyles = css`
  [part='content'] {
    position: relative;
  }

  [part='link'] {
    width: 100%;
    min-height: 32px;
    margin: 4px 0;
    padding: 4px 8px;
    padding-inline-start: calc(8px + var(--_child-indent, 0px));
    transition:
      background-color 140ms,
      color 140ms;
    border-radius: 4px;
    color: var(--material-body-text-color);
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    font-weight: 500;
    line-height: 1;
    cursor: default;
    gap: 8px;
  }

  [part='link'][href] {
    cursor: pointer;
  }

  :host([current]) [part='link'] {
    color: var(--material-primary-text-color);
  }

  :host([disabled]) [part='link'] {
    color: var(--material-disabled-text-color);
  }

  :host([current]) [part='content']::before {
    content: '';
    position: absolute;
    border-radius: 4px;
    opacity: 0.12;
    background-color: var(--material-primary-color);
    inset: 4px 0;
  }

  [part='toggle-button'] {
    width: 32px;
    height: 32px;
    margin-inline-end: -4px;
    transform: rotate(90deg);
  }

  [part='toggle-button']::before {
    content: var(--material-icons-chevron-right);
    display: inline-block;
    width: 24px;
    font-family: 'material-icons';
    font-size: 24px;
  }

  [part='toggle-button']::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(0);
    transition:
      transform 0s 0.8s,
      opacity 0.8s;
    border-radius: 50%;
    opacity: 0;
    background-color: var(--material-disabled-text-color);
    will-change: transform, opacity;
  }

  [part='toggle-button']:focus-visible::after {
    transform: scale(1.25);
    transition-duration: 0.08s, 0.01s;
    transition-delay: 0s, 0s;
    opacity: 0.16;
  }

  :host([expanded]) [part='toggle-button'] {
    transform: rotate(270deg);
  }

  :host([has-children]) [part='content'] {
    padding-inline-end: 8px;
  }

  @media (any-hover: hover) {
    :host(:not([current])) [part='link'][href]:hover {
      background-color: var(--material-secondary-background-color);
    }

    [part='toggle-button']:hover {
      color: var(--material-body-text-color);
    }
  }

  @supports selector(:focus-visible) {
    [part='link'],
    [part='toggle-button'] {
      outline: none;
    }

    :host(:not([current])) [part='link']:focus-visible {
      background-color: var(--material-divider-color);
    }

    :host([current]) [part='link']:focus-visible::before {
      opacity: 0.24;
    }
  }

  slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    flex-shrink: 0;
    margin-inline-end: 24px;
    padding: 0.1em;
    color: var(--material-secondary-text-color);
  }

  :host([disabled]) slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: var(--material-disabled-text-color);
  }

  :host([current]) slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: inherit;
  }

  slot[name='children'] {
    --_child-indent: calc(var(--_child-indent-2, 0px) + var(--vaadin-side-nav-child-indent, 24px));
  }

  slot[name='children']::slotted(*) {
    --_child-indent-2: var(--_child-indent);
  }
`;

registerStyles('vaadin-side-nav-item', [fieldButton, sideNavItemStyles], { moduleId: 'material-side-nav-item' });
