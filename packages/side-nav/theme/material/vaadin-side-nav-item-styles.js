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
    border-radius: 4px;
    color: var(--material-body-text-color);
    cursor: default;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    font-weight: 500;
    gap: 8px;
    line-height: 1;
    margin: 4px 0;
    min-height: 32px;
    padding: 4px 8px;
    padding-inline-start: calc(8px + var(--_child-indent, 0px));
    transition:
      background-color 140ms,
      color 140ms;
    width: 100%;
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
    background-color: var(--material-primary-color);
    border-radius: 4px;
    content: '';
    inset: 4px 0;
    opacity: 0.12;
    position: absolute;
  }

  [part='toggle-button'] {
    height: 32px;
    margin-inline-end: -4px;
    transform: rotate(90deg);
    width: 32px;
  }

  [part='toggle-button']::before {
    content: var(--material-icons-chevron-right);
    display: inline-block;
    font-family: 'material-icons';
    font-size: 24px;
    width: 24px;
  }

  [part='toggle-button']::after {
    background-color: var(--material-disabled-text-color);
    border-radius: 50%;
    content: '';
    display: inline-block;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transform: scale(0);
    transition:
      transform 0s 0.8s,
      opacity 0.8s;
    width: 100%;
    will-change: transform, opacity;
  }

  [part='toggle-button']:focus-visible::after {
    opacity: 0.16;
    transform: scale(1.25);
    transition-delay: 0s, 0s;
    transition-duration: 0.08s, 0.01s;
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
    color: var(--material-secondary-text-color);
    flex-shrink: 0;
    margin-inline-end: 24px;
    padding: 0.1em;
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
