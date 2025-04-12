import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavStyles = css`
  :host {
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    color: var(--lumo-body-text-color);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    line-height: var(--lumo-line-height-xs);
    -webkit-tap-highlight-color: transparent;
  }

  [part='label'] {
    align-items: center;
    border-radius: var(--lumo-border-radius-m);
    box-sizing: border-box;
    display: flex;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-s);
    font-weight: 500;
    line-height: var(--lumo-line-height-xs);
    outline: none;
    width: 100%;
  }

  [part='label'] ::slotted([slot='label']) {
    color: var(--lumo-secondary-text-color);
    margin: var(--lumo-space-s);
  }

  :host([focus-ring]) [part='label'] {
    box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
  }

  [part='toggle-button'] {
    align-items: center;
    color: var(--lumo-contrast-60pct);
    cursor: var(--lumo-clickable-cursor);
    display: inline-flex;
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-m);
    height: var(--lumo-size-s);
    justify-content: center;
    line-height: 1;
    margin-inline: auto var(--lumo-space-xs);
    width: var(--lumo-size-s);
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-angle-right);
    transition: transform 140ms;
  }

  :host(:not([collapsible])) [part='toggle-button'] {
    display: none !important;
  }

  :host(:not([collapsed])) [part='toggle-button']::before {
    transform: rotate(90deg);
  }

  :host([collapsed][dir='rtl']) [part='toggle-button']::before {
    transform: rotate(180deg);
  }

  @media (any-hover: hover) {
    [part='label']:hover [part='toggle-button'] {
      color: var(--lumo-body-text-color);
    }
  }
`;

registerStyles('vaadin-side-nav', sideNavStyles, { moduleId: 'lumo-side-nav' });
