/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export interface LoginI18n {
  form?: {
    title?: string;
    username?: string;
    password?: string;
    submit?: string;
    forgotPassword?: string;
  };
  errorMessage?: {
    title?: string;
    message?: string;
    username?: string;
    password?: string;
  };
  header?: {
    title?: string;
    description?: string;
  };
  additionalInformation?: string;
}

export declare function LoginMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<LoginMixinClass> & T;

export declare class LoginMixinClass {
  /**
   * If set, a synchronous POST call will be fired to the path defined.
   * The `login` event is also dispatched, so `event.preventDefault()` can be called to prevent the POST call.
   */
  action: string | null;

  /**
   * If set, disable the "Log in" button and prevent user from submitting login form.
   * It is re-enabled automatically, when error is set to true, allowing form resubmission
   * after user makes changes.
   */
  disabled: boolean;

  /**
   * If set, the error message is shown. The message is hidden by default.
   * When set, it changes the disabled state of the submit button.
   */
  error: boolean;

  /**
   * Whether to hide the forgot password button. The button is visible by default.
   * @attr {boolean} no-forgot-password
   */
  noForgotPassword: boolean;

  /**
   * If set, the user name field does not automatically receive focus when the component is attached to the document.
   * @attr {boolean} no-autofocus
   */
  noAutofocus: boolean;

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
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
   *     message: 'Check that you have entered the correct username and password and try again.',
   *     username: 'Username is required',
   *     password: 'Password is required'
   *   },
   *   additionalInformation: 'In case you need to provide some additional info for the user.'
   * }
   * ```
   */
  i18n: LoginI18n;

  /**
   * Sets the root heading level (`aria-level`) for the heading hierarchy. Default value: 1.
   * Child headings automatically increment from this base level i.e. standalone login form
   * renders its title as `<h1>`, whereas the form in the overlay uses `<h2>`, as the `<h1>`
   * element is used by the overlay's own title.
   *
   * @attr {number} heading-level
   */
  headingLevel: number;
}
