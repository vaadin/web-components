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
    align-items: center;
    border-radius: 4px;
    box-sizing: border-box;
    color: var(--material-secondary-text-color);
    display: flex;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    font-weight: 500;
    line-height: 1;
    margin: 4px 0;
    min-height: 40px;
    outline: none;
    padding: 4px 8px;
    width: 100%;
  }

  :host([focus-ring]) [part='label'] {
    background-color: var(--material-divider-color);
  }

  [part='toggle-button'] {
    align-items: center;
    color: var(--material-secondary-text-color);
    display: inline-flex;
    font-family: 'material-icons';
    font-size: var(--material-icon-font-size);
    height: 24px;
    justify-content: center;
    line-height: 1;
    margin-inline: auto -4px;
    padding: 4px;
    transform: rotate(90deg);
    width: 24px;
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
