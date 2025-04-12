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
    width: 100%;
    height: 100%;
    border-radius: 0;
    background: var(--material-secondary-background-color);
    box-shadow: none;
  }

  [part='content'] {
    display: flex;
    min-height: 100%;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  [part='card'] {
    display: flex;
    overflow: hidden;
    min-width: 400px;
    max-width: 100%;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    border-radius: 4px;
    margin: 0.5em;
    background: var(--material-secondary-background-color);
    box-shadow:
      0 19px 38px rgba(0, 0, 0, 0.04),
      0 9px 12px rgba(0, 0, 0, 0.05);
  }

  [part='brand'] {
    display: flex;
    overflow: hidden;
    min-height: 225px;
    box-sizing: border-box;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    justify-content: flex-start;
    padding: 2.8rem 2.5rem 1.5rem 3.5rem;
    background-color: var(--material-primary-color);
    color: var(--material-primary-contrast-color);
  }

  [part='title'] {
    margin: 0;
    color: inherit;
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: -0.015em;
    line-height: 1.1;
    text-indent: -0.07em;
  }

  [part='form'] {
    width: 90%;
    margin: auto;
    margin-bottom: -65px;
    background-color: var(--material-secondary-background-color);
  }

  [part='description'] {
    margin-bottom: 0;
    color: var(--material-secondary-background-color);
    line-height: 1.375;
  }

  /* RTL styles */
  :host([dir='rtl']) [part='brand'] {
    padding: 2.8rem 3.5rem 1.5rem 2.5rem;
  }

  /* Small screen */
  @media only screen and (max-width: 1023px) {
    [part='brand'] {
      min-height: 330px;
      justify-content: center;
      padding: 0 2.5rem 5.5rem 2rem;
    }

    [part='title'] {
      font-size: 1.8rem;
      font-weight: 500;
      text-indent: 1rem;
    }

    [part='form'] {
      margin-top: -80px;
      margin-bottom: 20px;
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
      min-height: 100%;
      align-items: flex-start;
      background: var(--material-background-color);
    }

    [part='card'] {
      overflow: auto;
      min-width: unset;
      max-height: none;
    }

    [part='card'],
    [part='overlay'] {
      width: 100%;
      border-radius: 0;
      margin: 0;
      box-shadow: none;
    }

    [part='brand'] {
      min-height: 225px;
      flex-grow: unset;
      justify-content: flex-start;
      padding: 2.5rem 2.5rem 1.5rem;
    }
  }

  /* Landscape small screen */
  @media only screen and (min-width: 600px) and (max-height: 600px) and (orientation: landscape) {
    [part='content'] {
      height: 100vh;
    }

    [part='card'] {
      width: 100%;
      height: 100%;
      flex-direction: row;
      border-radius: 0;
      margin: 0;
    }

    [part='brand'] {
      box-sizing: border-box;
      flex: auto;
      flex-basis: 0;
    }

    [part='form'] {
      overflow: auto;
      height: 100%;
      flex: auto;
      flex-basis: 0;
      margin: 0;
    }

    [part='form'] ::slotted(*) {
      bottom: 0;
      display: flex;
      min-height: 100%;
      max-height: none;
      margin: unset;
    }
  }

  /* Landscape big screen */
  @media only screen and (min-width: 1024px) {
    [part='card'] {
      width: 100%;
      max-width: 760px;
      height: auto;
      min-height: 0;
      flex-direction: row;
      align-items: stretch;
    }

    [part='content'] {
      max-width: 950px;
      height: 100%;
      margin: auto;
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
      max-width: none;
      margin: auto;
    }

    [part='card'] {
      max-width: 960px;
    }

    [part='brand'] {
      padding-right: 1rem;
      padding-left: 4rem;
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
      padding-right: 4rem;
      padding-left: 1rem;
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
      padding-left: calc(1.5rem + env(safe-area-inset-bottom));
      margin-left: calc(env(safe-area-inset-bottom) * -1);
    }

    /* RTL styles */
    :host([dir='rtl']) [part='brand'] {
      padding-right: calc(1.5rem + env(safe-area-inset-bottom));
      margin-right: calc(env(safe-area-inset-bottom) * -1);
    }
  }
`;

registerStyles('vaadin-login-overlay-wrapper', [overlay, typography, loginOverlayWrapper], {
  moduleId: 'material-login-overlay-wrapper',
});

const loginFormWrapper = css`
  :host([theme~='with-overlay']) {
    display: flex;
    width: 100%;
    justify-content: center;
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
