import '@vaadin/vaadin-lumo-styles/spacing.js';
import './vaadin-login-form-wrapper-styles.js';
import { color } from '@vaadin/vaadin-lumo-styles/color.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { typography } from '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const loginOverlayWrapper = css`
  :host {
    inset: 0;
  }

  [part='backdrop'] {
    background: var(--lumo-base-color) linear-gradient(var(--lumo-shade-5pct), var(--lumo-shade-5pct));
  }

  [part='overlay'] {
    background: none;
    border-radius: 0;
    box-shadow: none;
    height: 100%;
    width: 100%;
  }

  [part='brand'] {
    background-color: var(--lumo-primary-color);
    color: var(--lumo-primary-contrast-color);
    min-height: calc(var(--lumo-size-m) * 5);
    padding: var(--lumo-space-l) var(--lumo-space-xl) var(--lumo-space-l) var(--lumo-space-l);
  }

  [part='title'] {
    font-size: var(--lumo-font-size-xxxl);
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
  }

  [part='description'] {
    color: var(--lumo-tint-70pct);
    line-height: var(--lumo-line-height-s);
    margin-bottom: 0;
  }

  [part='content'] {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 0;
  }

  [part='card'] {
    background: var(--lumo-base-color) linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
    border-radius: var(--lumo-border-radius-l);
    box-shadow: var(--lumo-box-shadow-s);
    height: auto;
    margin: var(--lumo-space-s);
    width: calc(var(--lumo-size-m) * 10);
  }

  /* Small screen */
  @media only screen and (max-width: 500px) {
    [part='overlay'],
    [part='content'] {
      height: 100%;
    }

    [part='content'] {
      align-items: flex-start;
      background: var(--lumo-base-color);
      min-height: 100%;
    }

    [part='card'],
    [part='overlay'] {
      border-radius: 0;
      box-shadow: none;
      margin: 0;
      width: 100%;
    }

    /* RTL styles */
    :host([dir='rtl']) [part='brand'] {
      padding: var(--lumo-space-l) var(--lumo-space-l) var(--lumo-space-l) var(--lumo-space-xl);
    }
  }

  /* Landscape small screen */
  @media only screen and (max-height: 600px) and (min-width: 600px) and (orientation: landscape) {
    [part='card'] {
      align-items: stretch;
      flex-direction: row;
      max-width: calc(var(--lumo-size-m) * 16);
      width: 100%;
    }

    [part='brand'],
    [part='form'] {
      box-sizing: border-box;
      flex: auto;
      flex-basis: 0;
    }

    [part='brand'] {
      justify-content: flex-start;
    }

    [part='form'] {
      overflow: auto;
      padding: var(--lumo-space-l);
    }
  }

  /* Landscape really small screen */
  @media only screen and (max-height: 500px) and (min-width: 600px) and (orientation: landscape),
    only screen and (max-width: 600px) and (min-width: 600px) and (orientation: landscape) {
    [part='content'] {
      height: 100vh;
    }

    [part='card'] {
      border-radius: 0;
      box-shadow: none;
      flex: auto;
      height: 100%;
      margin: 0;
      max-width: none;
      width: 100%;
    }

    [part='form'] {
      height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }

  /* Handle iPhone X notch */
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    [part='card'] {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }

    [part='brand'] {
      margin-left: calc(env(safe-area-inset-left) * -1);
      padding-left: calc(var(--lumo-space-l) + env(safe-area-inset-left));
    }

    /* RTL styles */
    :host([dir='rtl']) [part='card'] {
      padding-left: env(safe-area-inset-right);
      padding-right: env(safe-area-inset-left);
    }

    :host([dir='rtl']) [part='brand'] {
      margin-right: calc(env(safe-area-inset-left) * -1);
      padding-right: calc(var(--lumo-space-l) + env(safe-area-inset-left));
    }
  }
`;

registerStyles('vaadin-login-overlay-wrapper', [color, typography, overlay, loginOverlayWrapper], {
  moduleId: 'lumo-login-overlay-wrapper',
});

const loginFormWrapper = css`
  :host([theme~='with-overlay']) {
    display: flex;
    justify-content: center;
    max-width: 100%;
    min-height: 100%;
  }

  /* Landscape small screen */
  @media only screen and (max-height: 600px) and (min-width: 600px) and (orientation: landscape) {
    :host([theme~='with-overlay']) [part='form'] {
      flex: 1;
      height: 100%;
      -webkit-overflow-scrolling: touch;
      padding: 2px;
    }
  }
`;

registerStyles('vaadin-login-form-wrapper', [loginFormWrapper], {
  moduleId: 'lumo-login-overlay',
});
