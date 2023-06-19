import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
