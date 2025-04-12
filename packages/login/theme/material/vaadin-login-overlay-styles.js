import '@vaadin/vaadin-material-styles/color.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { typography } from '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const loginOverlayWrapper = css`
  :host {
    inset: 0;
  }

  [part='backdrop'] {
    background: var(--material-background-color);
  }

  [part='overlay'] {
    background: var(--material-secondary-background-color);
    border-radius: 0;
    box-shadow: none;
    height: 100%;
    width: 100%;
  }

  [part='content'] {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 100%;
    padding: 0;
  }

  [part='card'] {
    background: var(--material-secondary-background-color);
    border-radius: 4px;
    box-shadow:
      0 19px 38px rgba(0, 0, 0, 0.04),
      0 9px 12px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0.5em;
    max-width: 100%;
    min-width: 400px;
    overflow: hidden;
  }

  [part='brand'] {
    background-color: var(--material-primary-color);
    box-sizing: border-box;
    color: var(--material-primary-contrast-color);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    justify-content: flex-start;
    min-height: 225px;
    overflow: hidden;
    padding: 2.8rem 2.5rem 1.5rem 3.5rem;
  }

  [part='title'] {
    color: inherit;
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: -0.015em;
    line-height: 1.1;
    margin: 0;
    text-indent: -0.07em;
  }

  [part='form'] {
    background-color: var(--material-secondary-background-color);
    margin: auto;
    margin-bottom: -65px;
    width: 90%;
  }

  [part='description'] {
    color: var(--material-secondary-background-color);
    line-height: 1.375;
    margin-bottom: 0;
  }

  /* RTL styles */
  :host([dir='rtl']) [part='brand'] {
    padding: 2.8rem 3.5rem 1.5rem 2.5rem;
  }

  /* Small screen */
  @media only screen and (max-width: 1023px) {
    [part='brand'] {
      justify-content: center;
      min-height: 330px;
      padding: 0 2.5rem 5.5rem 2rem;
    }

    [part='title'] {
      font-size: 1.8rem;
      font-weight: 500;
      text-indent: 1rem;
    }

    [part='form'] {
      margin-bottom: 20px;
      margin-top: -80px;
    }

    /* RTL styles */
    :host([dir='rtl']) [part='brand'] {
      padding: 0 2rem 5.5rem 2.5rem;
    }
  }

  /* Very small screen */
  @media only screen and (max-width: 413px) {
    [part='overlay'],
    [part='content'],
    [part='card'] {
      height: 100%;
    }

    [part='content'] {
      align-items: flex-start;
      background: var(--material-background-color);
      min-height: 100%;
    }

    [part='card'] {
      max-height: none;
      min-width: unset;
      overflow: auto;
    }

    [part='card'],
    [part='overlay'] {
      border-radius: 0;
      box-shadow: none;
      margin: 0;
      width: 100%;
    }

    [part='brand'] {
      flex-grow: unset;
      justify-content: flex-start;
      min-height: 225px;
      padding: 2.5rem 2.5rem 1.5rem;
    }
  }

  /* Landscape small screen */
  @media only screen and (min-width: 600px) and (max-height: 600px) and (orientation: landscape) {
    [part='content'] {
      height: 100vh;
    }

    [part='card'] {
      border-radius: 0;
      flex-direction: row;
      height: 100%;
      margin: 0;
      width: 100%;
    }

    [part='brand'] {
      box-sizing: border-box;
      flex: auto;
      flex-basis: 0;
    }

    [part='form'] {
      flex: auto;
      flex-basis: 0;
      height: 100%;
      margin: 0;
      overflow: auto;
    }

    [part='form'] ::slotted(*) {
      bottom: 0;
      display: flex;
      margin: unset;
      max-height: none;
      min-height: 100%;
    }
  }

  /* Landscape big screen */
  @media only screen and (min-width: 1024px) {
    [part='card'] {
      align-items: stretch;
      flex-direction: row;
      height: auto;
      max-width: 760px;
      min-height: 0;
      width: 100%;
    }

    [part='content'] {
      height: 100%;
      margin: auto;
      max-width: 950px;
    }

    [part='brand'] {
      justify-content: center;
      padding: 1.5rem 2.5rem 1.5rem 1.5rem;
    }

    [part='brand'],
    [part='form'] {
      box-sizing: border-box;
      flex: auto;
      flex-basis: 0;
    }

    [part='title'] {
      font-size: 2.5em;
    }

    [part='form'] {
      margin: 80px 30px 40px -20px;
      overflow-x: visible;
    }

    [part='form'] ::slotted(*) {
      height: 100%;
    }

    /* RTL styles */
    :host([dir='rtl']) [part='brand'] {
      padding: 1.5rem 1.5rem 1.5rem 2.5rem;
    }

    :host([dir='rtl']) [part='form'] {
      margin: 80px -20px 40px 30px;
    }
  }

  /* Landscape really big screen */
  @media only screen and (min-width: 1440px) {
    [part='content'] {
      margin: auto;
      max-width: none;
    }

    [part='card'] {
      max-width: 960px;
    }

    [part='brand'] {
      padding-left: 4rem;
      padding-right: 1rem;
    }

    [part='form'] {
      height: 100%;
      -webkit-overflow-scrolling: touch;
    }

    :host(:not([dir='rtl'])) [part='form'] {
      margin-right: 22px;
    }

    :host(:not([dir='rtl'])) [part='form'] ::slotted(*) {
      right: 80px;
    }

    /* RTL styles */
    :host([dir='rtl']) [part='brand'] {
      padding-left: 1rem;
      padding-right: 4rem;
    }

    :host([dir='rtl']) [part='form'] {
      margin-left: 22px;
    }

    :host([dir='rtl']) [part='form']::slotted(*) {
      left: 80px;
    }
  }

  /* Handle iPhone X notch */
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    [part='card'] {
      padding: 0 env(safe-area-inset-bottom);
    }

    :host(:not([dir='rtl'])) [part='brand'] {
      margin-left: calc(env(safe-area-inset-bottom) * -1);
      padding-left: calc(1.5rem + env(safe-area-inset-bottom));
    }

    /* RTL styles */
    :host([dir='rtl']) [part='brand'] {
      margin-right: calc(env(safe-area-inset-bottom) * -1);
      padding-right: calc(1.5rem + env(safe-area-inset-bottom));
    }
  }
`;

registerStyles('vaadin-login-overlay-wrapper', [overlay, typography, loginOverlayWrapper], {
  moduleId: 'material-login-overlay-wrapper',
});

const loginFormWrapper = css`
  :host([theme~='with-overlay']) {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  :host([theme~='with-overlay']) [part='form'] {
    padding: 2rem 2.5rem 2rem 1.8rem;
  }

  :host([theme~='with-overlay']) [part='form-title'] {
    font-size: 1.8em;
    font-weight: 500;
    text-align: center;
  }

  :host([theme~='with-overlay']) [part='form'] ::slotted(form) {
    display: flex;
    flex-direction: column;
  }

  /* Small screen */
  @media only screen and (max-width: 413px) {
    :host([theme~='with-overlay']) [part='form'] {
      padding-top: 0.75rem;
    }
  }

  /* Landscape big screen */
  @media only screen and (min-width: 1024px) {
    :host([theme~='with-overlay']) [part='form'] {
      padding: 2em;
    }

    :host([theme~='with-overlay']) [part='form'] ::slotted(form) {
      margin-top: 15px;
    }
  }

  /* RTL styles */
  :host([dir='rtl'][theme~='with-overlay']) [part='form'] {
    padding: 2rem 1.8rem 2rem 2.5rem;
  }
`;

registerStyles('vaadin-login-form-wrapper', [loginFormWrapper], { moduleId: 'material-login-overlay' });
