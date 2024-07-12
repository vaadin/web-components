import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const detailsSummary = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: relative;
    outline: none;
    min-height: 48px;
    padding: 0 24px;
    box-sizing: border-box;
    font-weight: 500;
    font-size: var(--material-small-font-size);
    background-color: var(--material-background-color);
    color: var(--material-body-text-color);
    cursor: default;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :host([disabled]) {
    color: var(--material-disabled-text-color);
    background-color: var(--material-disabled-color);
  }

  [part='content'] {
    margin: 0;
    position: relative;
  }

  [part='toggle'] {
    position: relative;
    order: 1;
    margin-inline-start: auto;
    right: -8px;
    width: 24px;
    height: 24px;
    padding: 4px;
    color: var(--material-secondary-text-color);
    line-height: 24px;
    text-align: center;
    transform: rotate(90deg);
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
  }

  [part='toggle']::before {
    font-family: 'material-icons';
    font-size: 24px;
    width: 24px;
    display: inline-block;
    content: var(--material-icons-chevron-right);
  }

  [part='toggle']::after {
    display: inline-block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--material-disabled-text-color);
    transform: scale(0);
    opacity: 0;
    transition:
      transform 0s 0.8s,
      opacity 0.8s;
    will-change: transform, opacity;
  }

  :host([disabled]) [part='toggle'] {
    color: var(--material-disabled-color);
  }

  :host([active]:not([disabled])) [part='toggle']::after {
    transition-duration: 0.08s, 0.01s;
    transition-delay: 0s, 0s;
    transform: scale(1.25);
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
    left: auto;
    right: 0;
  }
`;

registerStyles('vaadin-details-summary', detailsSummary, { moduleId: 'material-details-summary' });

export { detailsSummary };
