/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const LoginMixin = (superClass) =>
  class LoginMixin extends superClass {
    /**
     * Fired when user clicks on the "Forgot password" button.
     *
     * @event forgot-password
     */

    /**
     * Fired when an user submits the login.
     * The event contains `username` and `password` values in the `detail` property.
     *
     * @event login
     */

    static get properties() {
      return {
        /**
         * If set, a synchronous POST call will be fired to the path defined.
         * The `login` event is also dispatched, so `event.preventDefault()` can be called to prevent the POST call.
         * @type {string | null}
         */
        action: {
          type: String,
          value: null,
          notify: true,
        },

        /**
         * If set, disable the "Log in" button and prevent user from submitting login form.
         * It is re-enabled automatically, when error is set to true, allowing form resubmission
         * after user makes changes.
         * @type {boolean}
         */
        disabled: {
          type: Boolean,
          value: false,
          notify: true,
        },

        /**
         * If set, the error message is shown. The message is hidden by default.
         * When set, it changes the disabled state of the submit button.
         * @type {boolean}
         */
        error: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true,
        },

        /**
         * Whether to hide the forgot password button. The button is visible by default.
         * @type {boolean}
         * @attr {boolean} no-forgot-password
         */
        noForgotPassword: {
          type: Boolean,
          value: false,
          notify: true,
        },

        /**
         * If set, the user name field automatically receives focus when the component is attached to the document.
         * @type {boolean}
         * @attr {boolean} no-autofocus
         */
        noAutofocus: {
          type: Boolean,
          value: false,
        },

        /**
         * The object used to localize this component.
         * For changing the default localization, change the entire
         * _i18n_ object or just the property you want to modify.
         *
         * The object has the following JSON structure (by default it doesn't include `additionalInformation`
         * and `header` sections, `header` can be added to override `title` and `description` properties
         * in `vaadin-login-overlay`):
         *
         * ```
         * {
         *   header: {
         *     title: 'App name',
         *     description: 'Inspiring application description'
         *   },
         *   form: {
         *     title: 'Log in',
         *     username: 'Username',
         *     password: 'Password',
         *     submit: 'Log in',
         *     forgotPassword: 'Forgot password'
         *   },
         *   errorMessage: {
         *     title: 'Incorrect username or password',
         *     message: 'Check that you have entered the correct username and password and try again.'
         *   },
         *   additionalInformation: 'In case you need to provide some additional info for the user.'
         * }
         * ```
         *
         * @type {!LoginI18n}
         * @default {English/US}
         */
        i18n: {
          type: Object,
          value() {
            return {
              form: {
                title: 'Log in',
                username: 'Username',
                password: 'Password',
                submit: 'Log in',
                forgotPassword: 'Forgot password',
              },
              errorMessage: {
                title: 'Incorrect username or password',
                message: 'Check that you have entered the correct username and password and try again.',
              },
            };
          },
          notify: true,
        },

        /**
         * If set, prevents auto enabling the component when error property is set to true.
         * @private
         */
        _preventAutoEnable: {
          type: Boolean,
          value: false,
        },
      };
    }

    /**
     * @param {!Event} e
     * @protected
     */
    _retargetEvent(e) {
      e.stopPropagation();
      const { detail, composed, cancelable, bubbles } = e;

      const firedEvent = this.dispatchEvent(new CustomEvent(e.type, { bubbles, cancelable, composed, detail }));
      // Check if `eventTarget.preventDefault()` was called to prevent default in the original event
      if (!firedEvent) {
        e.preventDefault();
      }
    }
  };
