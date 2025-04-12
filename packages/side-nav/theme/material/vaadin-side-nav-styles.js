import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavStyles = css`
  :host {
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  [part='label'] {
    display: flex;
    width: 100%;
    min-height: 40px;
    box-sizing: border-box;
    align-items: center;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 4px 0;
    color: var(--material-secondary-text-color);
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    font-weight: 500;
    line-height: 1;
    outline: none;
  }

  :host([focus-ring]) [part='label'] {
    background-color: var(--material-divider-color);
  }

  [part='toggle-button'] {
    display: inline-flex;
    width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
    padding: 4px;
    color: var(--material-secondary-text-color);
    font-family: 'material-icons';
    font-size: var(--material-icon-font-size);
    line-height: 1;
    margin-inline: auto -4px;
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
