import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const detailsSummary = css`
  :host {
    display: flex;
    position: relative;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 48px;
    padding: 0 24px;
    outline: none;
    background-color: var(--material-background-color);
    color: var(--material-body-text-color);
    font-size: var(--material-small-font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 500;
    cursor: default;
    -webkit-tap-highlight-color: transparent;
  }

  :host([disabled]) {
    background-color: var(--material-disabled-color);
    color: var(--material-disabled-text-color);
  }

  [part='content'] {
    position: relative;
    margin: 0;
  }

  [part='toggle'] {
    position: relative;
    right: -8px;
    order: 1;
    width: 24px;
    height: 24px;
    margin-inline-start: auto;
    padding: 4px;
    transform: rotate(90deg);
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
    color: var(--material-secondary-text-color);
    line-height: 24px;
    text-align: center;
  }

  [part='toggle']::before {
    content: var(--material-icons-chevron-right);
    display: inline-block;
    width: 24px;
    font-family: 'material-icons';
    font-size: 24px;
  }

  [part='toggle']::after {
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

  :host([disabled]) [part='toggle'] {
    color: var(--material-disabled-color);
  }

  :host([active]:not([disabled])) [part='toggle']::after {
    transform: scale(1.25);
    transition-duration: 0.08s, 0.01s;
    transition-delay: 0s, 0s;
    opacity: 0.15;
  }

  :host([opened]) [part='toggle'] {
    transform: rotate(270deg);
  }

  /* RTL specific styles */
  :host([dir='rtl']) [part='toggle'] {
    right: 8px;
  }

  :host([dir='rtl']) [part='toggle']::after {
    right: 0;
    left: auto;
  }
`;

registerStyles('vaadin-details-summary', detailsSummary, { moduleId: 'material-details-summary' });

export { detailsSummary };
