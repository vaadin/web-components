import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const detailsSummary = css`
  :host {
    align-items: center;
    background-color: var(--material-background-color);
    box-sizing: border-box;
    color: var(--material-body-text-color);
    cursor: default;
    display: flex;
    font-size: var(--material-small-font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 500;
    justify-content: space-between;
    min-height: 48px;
    outline: none;
    padding: 0 24px;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    width: 100%;
  }

  :host([disabled]) {
    background-color: var(--material-disabled-color);
    color: var(--material-disabled-text-color);
  }

  [part='content'] {
    margin: 0;
    position: relative;
  }

  [part='toggle'] {
    color: var(--material-secondary-text-color);
    height: 24px;
    line-height: 24px;
    margin-inline-start: auto;
    order: 1;
    padding: 4px;
    position: relative;
    right: -8px;
    text-align: center;
    transform: rotate(90deg);
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
    width: 24px;
  }

  [part='toggle']::before {
    content: var(--material-icons-chevron-right);
    display: inline-block;
    font-family: 'material-icons';
    font-size: 24px;
    width: 24px;
  }

  [part='toggle']::after {
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

  :host([disabled]) [part='toggle'] {
    color: var(--material-disabled-color);
  }

  :host([active]:not([disabled])) [part='toggle']::after {
    opacity: 0.15;
    transform: scale(1.25);
    transition-delay: 0s, 0s;
    transition-duration: 0.08s, 0.01s;
  }

  :host([opened]) [part='toggle'] {
    transform: rotate(270deg);
  }

  /* RTL specific styles */
  :host([dir='rtl']) [part='toggle'] {
    right: 8px;
  }

  :host([dir='rtl']) [part='toggle']::after {
    left: auto;
    right: 0;
  }
`;

registerStyles('vaadin-details-summary', detailsSummary, { moduleId: 'material-details-summary' });

export { detailsSummary };
