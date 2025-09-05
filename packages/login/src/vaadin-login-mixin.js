/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';

const DEFAULT_I18N = {
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
    username: 'Username is required',
    password: 'Password is required',
  },
};

/**
 * @mixes LoginMixin
 * @polymerMixin
 */
export const LoginMixin = (superClass) =>
  class LoginMixin extends I18nMixin(DEFAULT_I18N, superClass) {
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
         * Sets the root heading level (`aria-level`) for the heading hierarchy. Default value: 1.
         * Child headings automatically increment from this base level i.e. standalone login form
         * renders its title as `<h1>`, whereas the form in the overlay uses `<h2>`, as the `<h1>`
         * element is used by the overlay's own title.
         *
         * @attr {number} heading-level
         */
        headingLevel: {
          type: Number,
          value: 1,
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
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure (by default it doesn't include `additionalInformation`
     * and `header` sections, `header` can be added to override `title` and `description` properties
     * in `vaadin-login-overlay`):
     *
     * ```js
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
     *     message: 'Check that you have entered the correct username and password and try again.',
     *     username: 'Username is required',
     *     password: 'Password is required'
     *   },
     *   additionalInformation: 'In case you need to provide some additional info for the user.'
     * }
     * ```
     * @return {!LoginI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }
  };
