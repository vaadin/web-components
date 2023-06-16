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

  summary {
    cursor: var(--lumo-clickable-cursor, default);
    border-radius: var(--lumo-border-radius-m);
  }

  summary ::slotted([slot='label']) {
    font-size: var(--lumo-font-size-s);
    color: var(--lumo-secondary-text-color);
    margin: var(--lumo-space-s);
    border-radius: inherit;
  }

  summary::after {
    font-family: lumo-icons;
    color: var(--lumo-tertiary-text-color);
    font-size: var(--lumo-icon-size-m);
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
`;

registerStyles('vaadin-side-nav', sideNavStyles, { moduleId: 'lumo-side-nav' });
