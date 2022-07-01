/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export interface LoginI18n {
  form: {
    title: string;
    username: string;
    password: string;
    submit: string;
    forgotPassword: string;
  };
  errorMessage: {
    title: string;
    message: string;
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
   * The object used to localize this component.
   * For changing the default localization, change the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure (by default it doesn't include `additionalInformation`
   * and `header` sections, `header` can be added to override `title` and `description` properties
   * in `vaadin-login-overlay`):
   *
   *         {
   *           header: {
   *             title: 'App name',
   *             description: 'Inspiring application description'
   *           },
   *           form: {
   *             title: 'Log in',
   *             username: 'Username',
   *             password: 'Password',
   *             submit: 'Log in',
   *             forgotPassword: 'Forgot password'
   *           },
   *           errorMessage: {
   *             title: 'Incorrect username or password',
   *             message: 'Check that you have entered the correct username and password and try again.'
   *           },
   *           additionalInformation: 'In case you need to provide some additional info for the user.'
   *         }
   */
  i18n: LoginI18n;

  protected _retargetEvent(e: Event): void;
}
