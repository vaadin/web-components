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
    display: flex;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    border-radius: var(--lumo-border-radius-m);
    outline: none;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-s);
    font-weight: 500;
    line-height: var(--lumo-line-height-xs);
  }

  [part='label'] ::slotted([slot='label']) {
    margin: var(--lumo-space-s);
    color: var(--lumo-secondary-text-color);
  }

  :host([focus-ring]) [part='label'] {
    box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
  }

  [part='toggle-button'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--lumo-size-s);
    height: var(--lumo-size-s);
    margin-inline: auto var(--lumo-space-xs);
    color: var(--lumo-contrast-60pct);
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-m);
    line-height: 1;
    cursor: var(--lumo-clickable-cursor);
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
