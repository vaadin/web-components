import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tabsheet = css`
  /* Needed to align the tabs nicely on the baseline */
  ::slotted([slot='tabs'])::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
  }

  [part='tabs-container'] {
    border-bottom: 1px solid var(--material-divider-color);
    font-family: var(--material-font-family);
  }

  [part='content'] {
    font-family: var(--material-font-family);
    padding: 8px 24px 24px;
  }

  :host([loading]) [part='content']::before {
    content: '';
    display: block;
    height: 2px;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    background: var(--material-background-color)
      linear-gradient(
        90deg,
        transparent 0%,
        transparent 20%,
        var(--material-primary-color) 20%,
        var(--material-primary-color) 40%,
        transparent 40%,
        transparent 60%,
        var(--material-primary-color) 60%,
        var(--material-primary-color) 80%,
        transparent 80%,
        transparent 100%
      )
      0 0 / 400% 100% repeat-x;
    animation: 3s linear infinite material-combo-box-loader-progress, 0.3s 0.1s both material-combo-box-loader-fade-in;
  }

  @keyframes material-combo-box-loader-fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes material-combo-box-loader-progress {
    0% {
      background-position: 0 0;
      background-size: 300% 100%;
    }

    33% {
      background-position: -100% 0;
      background-size: 400% 100%;
    }

    67% {
      background-position: -200% 0;
      background-size: 250% 100%;
    }

    100% {
      background-position: -300% 0;
      background-size: 300% 100%;
    }
  }

  /* RTL specific styles */

  @keyframes material-combo-box-loader-progress-rtl {
    0% {
      background-position: 100% 0;
      background-size: 300% 100%;
    }

    33% {
      background-position: 200% 0;
      background-size: 400% 100%;
    }

    67% {
      background-position: 300% 0;
      background-size: 250% 100%;
    }

    100% {
      background-position: 400% 0;
      background-size: 300% 100%;
    }
  }

  :host([loading][dir='rtl']) [part='content']::before {
    animation: 3s linear infinite material-combo-box-loader-progress-rtl,
      0.3s 0.1s both material-combo-box-loader-fade-in;
  }
`;

registerStyles('vaadin-tabsheet', tabsheet, { moduleId: 'material-tabsheet' });
