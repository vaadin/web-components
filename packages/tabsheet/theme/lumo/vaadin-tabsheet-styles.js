import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tabsheet = css`
  ::slotted([slot='tabs']) {
    box-shadow: initial;
  }

  /* Needed to align the tabs nicely on the baseline */
  ::slotted([slot='tabs'])::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
  }

  [part='tabs-container'] {
    box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
    font-family: var(--lumo-font-family);
  }

  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-m) var(--lumo-space-s);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    font-family: var(--lumo-font-family);
  }

  :host([theme~='content-borders']) [part='content'] {
    border: 1px solid var(--lumo-contrast-10pct);
    border-top: none;
  }

  :host([loading]) [part='content']::before {
    content: '';
    box-sizing: border-box;
    width: var(--lumo-icon-size-s);
    height: var(--lumo-icon-size-s);
    margin-left: calc(var(--lumo-icon-size-s) / -2);
    margin-top: calc(var(--lumo-icon-size-s) / -2);
    left: 50%;
    top: 50%;
    position: absolute;
    border: 2px solid transparent;
    border-color: var(--lumo-primary-color-50pct) var(--lumo-primary-color-50pct) var(--lumo-primary-color)
      var(--lumo-primary-color);
    border-radius: calc(0.5 * var(--lumo-icon-size-s));
    opacity: 0;
    animation: 1s linear infinite lumo-combo-box-loader-rotate, 0.3s 0.1s lumo-combo-box-loader-fade-in both;
    pointer-events: none;
  }

  @keyframes lumo-combo-box-loader-fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes lumo-combo-box-loader-rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

registerStyles('vaadin-tabsheet', tabsheet, { moduleId: 'lumo-tabsheet' });

export { tabsheet };
