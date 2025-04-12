import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import { colorDark } from '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-notification-container',
  css`
    :host {
      inset: 0 4px;
    }

    @media (min-width: 420px) {
      :host {
        inset: 0 12px;
      }
    }
  `,
  { moduleId: 'material-notification-container' },
);

const notificationCard = css`
  :host {
    min-height: 48px;
    margin: 8px 4px;
    background-color: transparent;
  }

  [part='overlay'] {
    justify-content: stretch;
    padding: 14px 16px;
    border-radius: 4px;
    background-color: var(--material-background-color);
    box-shadow: var(--material-shadow-elevation-6dp);
  }

  [part='content'] {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    text-transform: none;
  }

  /* NOTE(platosha): Makes the button take exactly 1 line of vertical space */
  [part='content'] ::slotted(vaadin-button) {
    margin: -8px 0;
  }

  :host([slot$='stretch']) {
    margin: 0 -4px;
  }

  :host([slot$='stretch']) [part='overlay'] {
    border-radius: 0;
  }

  @media (min-width: 420px) {
    :host {
      margin: 24px 12px;
    }

    :host([slot^='middle']) {
      width: 372px;
      margin: auto;
    }

    :host([slot$='stretch']) {
      margin: 0 -12px;
    }
  }

  @keyframes material-notification-exit-fade-out {
    100% {
      opacity: 0;
    }
  }

  @keyframes material-notification-enter-fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes material-notification-enter-slide-down {
    0% {
      opacity: 0;
      transform: translateY(-200%);
    }
  }

  @keyframes material-notification-exit-slide-up {
    100% {
      opacity: 0;
      transform: translateY(-200%);
    }
  }

  @keyframes material-notification-enter-slide-up {
    0% {
      opacity: 0;
      transform: translateY(200%);
    }
  }

  @keyframes material-notification-exit-slide-down {
    100% {
      opacity: 0;
      transform: translateY(200%);
    }
  }

  :host([slot='middle'][opening]) {
    animation: material-notification-enter-fade-in 300ms;
  }

  :host([slot='middle'][closing]) {
    animation: material-notification-exit-fade-out 300ms;
  }

  :host([slot^='top'][opening]) {
    animation: material-notification-enter-slide-down 300ms;
  }

  :host([slot^='top'][closing]) {
    animation: material-notification-exit-slide-up 300ms;
  }

  :host([slot^='bottom'][opening]) {
    animation: material-notification-enter-slide-up 300ms;
  }

  :host([slot^='bottom'][closing]) {
    animation: material-notification-exit-slide-down 300ms;
  }
`;

registerStyles('vaadin-notification-card', [colorDark, notificationCard], {
  moduleId: 'material-notification-card',
});
