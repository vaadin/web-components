import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavStyles = css`
  :host {
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  [part='label'] {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    margin: 4px 0;
    padding: 4px 8px;
    outline: none;
    box-sizing: border-box;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    color: var(--material-secondary-text-color);
    line-height: 1;
    font-weight: 500;
    border-radius: 4px;
  }

  :host([focus-ring]) [part='label'] {
    background-color: var(--material-divider-color);
  }

  [part='toggle-button'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 4px;
    margin-inline: auto -4px;
    font-size: var(--material-icon-font-size);
    line-height: 1;
    color: var(--material-secondary-text-color);
    font-family: 'material-icons';
    transform: rotate(90deg);
  }

  [part='toggle-button']::before {
    content: var(--material-icons-chevron-right);
    font-size: 24px;
  }

  :host(:not([collapsible])) [part='toggle-button'] {
    display: none !important;
  }

  :host(:not([collapsed])) [part='toggle-button'] {
    transform: rotate(270deg);
  }

  @media (any-hover: hover) {
    [part='label']:hover [part='toggle-button'] {
      color: var(--material-body-text-color);
    }
  }
`;

registerStyles('vaadin-side-nav', sideNavStyles, { moduleId: 'material-side-nav' });
