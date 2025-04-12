import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const detailsSummary = css`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    min-height: 48px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background-color: var(--material-background-color);
    color: var(--material-body-text-color);
    cursor: default;
    font-size: var(--material-small-font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 500;
    outline: none;
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
    width: 24px;
    height: 24px;
    order: 1;
    padding: 4px;
    color: var(--material-secondary-text-color);
    line-height: 24px;
    margin-inline-start: auto;
    text-align: center;
    transform: rotate(90deg);
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
  }

  [part='toggle']::before {
    display: inline-block;
    width: 24px;
    content: var(--material-icons-chevron-right);
    font-family: 'material-icons';
    font-size: 24px;
  }

  [part='toggle']::after {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--material-disabled-text-color);
    content: '';
    opacity: 0;
    transform: scale(0);
    transition:
      transform 0s 0.8s,
      opacity 0.8s;
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
    right: 0;
    left: auto;
  }
`;

registerStyles('vaadin-details-summary', detailsSummary, { moduleId: 'material-details-summary' });

export { detailsSummary };
