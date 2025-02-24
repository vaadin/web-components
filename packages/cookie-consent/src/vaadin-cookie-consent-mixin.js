/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import 'cookieconsent/build/cookieconsent.min.js';

/**
 * @polymerMixin
 */
export const CookieConsentMixin = (superClass) =>
  class CookieConsentMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The message to show in the popup.
         * @type {string}
         */
        message: {
          type: String,
          value: 'This website uses cookies to ensure you get the best experience.',
        },

        /**
         * The text to show on the dismiss/consent button.
         * @type {string}
         */
        dismiss: {
          type: String,
          value: 'Got it!',
        },

        /**
         * The text to show on the 'learn more' link.
         * @attr {string} learn-more
         * @type {string}
         */
        learnMore: {
          type: String,
          value: 'Learn more',
        },

        /**
         * The URL the 'learn more' link should open.
         * @attr {string} learn-more-link
         * @type {string}
         */
        learnMoreLink: {
          type: String,
          value: 'https://cookiesandyou.com/',
        },

        /** @private */
        _showLearnMore: {
          type: Boolean,
          computed: '_showLink(learnMoreLink)',
        },

        /**
         * Determines the position of the banner.
         *
         * Possible values are: `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right`
         * For `top` and `bottom`, the banner is shown with full width. For the corner positions,
         * it is shown as a smaller popup.
         * @type {string}
         */
        position: {
          type: String,
          value: 'top',
        },

        /**
         * The name of the cookie to set to remember that the user has consented.
         *
         * This rarely needs to be changed.
         * @attr {string} cookie-name
         * @type {string}
         */
        cookieName: {
          type: String,
          value: 'cookieconsent_status',
        },

        /** @private */
        _css: {
          type: Object,
        },
      };
    }

    static get observers() {
      return ['__initialize(_showLearnMore, message, dismiss, learnMore, learnMoreLink, cookieName, position)'];
    }

    /** @private */
    _showLink(learnMoreLink) {
      return !!learnMoreLink;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // CSS is global so it must be injected into head...
      this._css = document.createElement('style');
      // prettier-ignore
      this._css.innerText = '.cc-window{opacity:1;transition:opacity 1s ease}.cc-window.cc-invisible{opacity:0}.cc-animate.cc-revoke{transition:transform 1s ease}.cc-animate.cc-revoke.cc-top{transform:translateY(-2em)}.cc-animate.cc-revoke.cc-bottom{transform:translateY(2em)}.cc-animate.cc-revoke.cc-active.cc-bottom,.cc-animate.cc-revoke.cc-active.cc-top,.cc-revoke:hover{transform:translateY(0)}.cc-grower{max-height:0;overflow:hidden;transition:max-height 1s}.cc-link,.cc-revoke:hover{text-decoration:underline}.cc-revoke,.cc-window{position:fixed;overflow:hidden;box-sizing:border-box;font-family:Helvetica,Calibri,Arial,sans-serif;font-size:16px;line-height:1.5em;display:flex;flex-wrap:nowrap;z-index:9999}.cc-window.cc-static{position:static}.cc-window.cc-floating{padding:2em;max-width:24em;flex-direction:column}.cc-window.cc-banner{padding:1em 1.8em;width:100%;flex-direction:row}.cc-revoke{padding:.5em}.cc-header{font-size:18px;font-weight:700}.cc-btn,.cc-close,.cc-link,.cc-revoke{cursor:pointer}.cc-link{opacity:.8;display:inline-block;padding:.2em}.cc-link:hover{opacity:1}.cc-link:active,.cc-link:visited{color:initial}.cc-btn{display:block;padding:.4em .8em;font-size:.9em;font-weight:700;border-width:2px;border-style:solid;text-align:center;white-space:nowrap}.cc-banner .cc-btn:last-child{min-width:140px}.cc-highlight .cc-btn:first-child{background-color:transparent;border-color:transparent}.cc-highlight .cc-btn:first-child:focus,.cc-highlight .cc-btn:first-child:hover{background-color:transparent;text-decoration:underline}.cc-close{display:block;position:absolute;top:.5em;right:.5em;font-size:1.6em;opacity:.9;line-height:.75}.cc-close:focus,.cc-close:hover{opacity:1}.cc-revoke.cc-top{top:0;left:3em;border-bottom-left-radius:.5em;border-bottom-right-radius:.5em}.cc-revoke.cc-bottom{bottom:0;left:3em;border-top-left-radius:.5em;border-top-right-radius:.5em}.cc-revoke.cc-left{left:3em;right:unset}.cc-revoke.cc-right{right:3em;left:unset}.cc-top{top:1em}.cc-left{left:1em}.cc-right{right:1em}.cc-bottom{bottom:1em}.cc-floating>.cc-link{margin-bottom:1em}.cc-floating .cc-message{display:block;margin-bottom:1em}.cc-window.cc-floating .cc-compliance{flex:1 0 auto}.cc-window.cc-banner{align-items:center}.cc-banner.cc-top{left:0;right:0;top:0}.cc-banner.cc-bottom{left:0;right:0;bottom:0}.cc-banner .cc-message{flex:1}.cc-compliance{display:flex;align-items:center;align-content:space-between}.cc-compliance>.cc-btn{flex:1}.cc-btn+.cc-btn{margin-left:.5em}@media print{.cc-revoke,.cc-window{display:none}}@media screen and (max-width:900px){.cc-btn{white-space:normal}}@media screen and (max-width:414px) and (orientation:portrait),screen and (max-width:736px) and (orientation:landscape){.cc-window.cc-top{top:0}.cc-window.cc-bottom{bottom:0}.cc-window.cc-banner,.cc-window.cc-left,.cc-window.cc-right{left:0;right:0}.cc-window.cc-banner{flex-direction:column}.cc-window.cc-banner .cc-compliance{flex:1}.cc-window.cc-floating{max-width:none}.cc-window .cc-message{margin-bottom:1em}.cc-window.cc-banner{align-items:unset}}.cc-floating.cc-theme-classic{padding:1.2em;border-radius:5px}.cc-floating.cc-type-info.cc-theme-classic .cc-compliance{text-align:center;display:inline;flex:none}.cc-theme-classic .cc-btn{border-radius:5px}.cc-theme-classic .cc-btn:last-child{min-width:140px}.cc-floating.cc-type-info.cc-theme-classic .cc-btn{display:inline-block}.cc-theme-edgeless.cc-window{padding:0}.cc-floating.cc-theme-edgeless .cc-message{margin:2em 2em 1.5em}.cc-banner.cc-theme-edgeless .cc-btn{margin:0;padding:.8em 1.8em;height:100%}.cc-banner.cc-theme-edgeless .cc-message{margin-left:1em}.cc-floating.cc-theme-edgeless .cc-btn+.cc-btn{margin-left:0}';
      document.head.appendChild(this._css);

      this.__initialize(
        this._showLearnMore,
        this.message,
        this.dismiss,
        this.learnMore,
        this.learnMoreLink,
        this.cookieName,
        this.position,
      );
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__closePopup();
      if (this._css.isConnected) {
        this._css.remove();
      }
    }

    /** @private */
    __closePopup() {
      const popup = this._getPopup();
      if (popup) {
        popup.parentNode.removeChild(popup);
      }
    }

    /** @private */
    // eslint-disable-next-line @typescript-eslint/max-params
    __initialize(_showLearnMore, message, dismiss, learnMore, learnMoreLink, cookieName, position) {
      this.__closePopup();

      window.cookieconsent.initialise({
        palette: {
          popup: {
            background: '#000',
          },
          button: {
            // Cannot use a lumo color 'as is' due to
            // https://github.com/vaadin/vaadin-lumo-styles/issues/22
            // var(--lumo-primary-color) at 0.95 opacity
            background: 'rgba(22, 118, 243, 0.95)',
            hover: 'rgba(22, 118, 243, 1)',
          },
        },
        showLink: _showLearnMore,
        content: {
          message,
          dismiss,
          link: learnMore,
          href: learnMoreLink,
        },
        cookie: {
          name: cookieName,
        },
        position,
        elements: {
          messagelink: `<span id="cookieconsent:desc" class="cc-message">${message} <a tabindex="0" class="cc-link" href="${learnMoreLink}" target="_blank" rel="noopener noreferrer nofollow">${learnMore}</a></span>`,
          dismiss: `<a tabindex="0" class="cc-btn cc-dismiss">${dismiss}</a>`,
        },
      });

      const popup = this._getPopup();
      if (popup) {
        // NVDA announces a popup appearance only if the role is alert
        popup.setAttribute('role', 'alert');

        // In order to make an `<a>` element act as a button, setting
        // `role="button"` is not enough: https://developer.mozilla.org/en-US
        // /docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role
        const dismissButton = popup.querySelector('a.cc-btn');
        dismissButton.addEventListener('keydown', (event) => {
          const SPACE = 32;
          const ENTER = 13;
          const key = event.keyCode || event.which;
          if (key === SPACE || key === ENTER) {
            dismissButton.click();
          }
        });
      }
    }

    /** @private */
    _getPopup() {
      return document.querySelector('[aria-label="cookieconsent"]');
    }

    /**
     * Shows the popup even if the user has seen it before.
     * @protected
     */
    _show() {
      const popup = this._getPopup();
      if (popup) {
        popup.classList.remove('cc-invisible');
        popup.style.display = '';
      }
    }
  };
