/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginFormMixin } from './vaadin-login-form-mixin.js';
export { LoginI18n } from './vaadin-login-mixin.js';

/**
 * Fired when the `disabled` property changes.
 */
export type LoginFormDisabledChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `error` property changes.
 */
export type LoginFormErrorChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when a user submits the login.
 */
export type LoginFormLoginEvent = CustomEvent<{ username: string; password: string }>;

export interface LoginFormCustomEventMap {
  'disabled-changed': LoginFormDisabledChangedEvent;

  'error-changed': LoginFormErrorChangedEvent;

  'forgot-password': Event;

  login: LoginFormLoginEvent;
}

export interface LoginFormEventMap extends HTMLElementEventMap, LoginFormCustomEventMap {}

/**
 * `<vaadin-login-form>` is a Web Component providing an easy way to require users
 * to log in into an application. Note that component has no shadowRoot.
 *
 * ```
 * <vaadin-login-form></vaadin-login-form>
 * ```
 *
 * Component has to be accessible from the `document` layer in order to allow password managers to work properly with form values.
 * Using `<vaadin-login-overlay>` allows to always attach the component to the document body.
 *
 * ### Styling
 *
 * The component doesn't have a shadowRoot, so the `<form>` and input fields can be styled from a global scope.
 *
 * Use `<vaadin-login-form-wrapper>` themable component to apply styles.
 * The following shadow DOM parts of the `<vaadin-login-form-wrapper>` are available for styling:
 *
 * Part name      | Description
 * ---------------|---------------------------------------------------------|
 * `form`         | Container for the entire component's content
 * `form-title`   | Title of the login form
 * `error-message`| Container for error message, contains error-message-title and error-message-description parts. Hidden by default.
 * `error-message-title`       | Container for error message title
 * `error-message-description` | Container for error message description
 * `footer`  | Container additional information text from `i18n` object
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} disabled-changed - Fired when the `disabled` property changes.
 * @fires {CustomEvent} error-changed - Fired when the `error` property changes.
 * @fires {CustomEvent} forgot-password - Fired when user clicks on the "Forgot password" button.
 * @fires {CustomEvent} login - Fired when a user submits the login.
 */
declare class LoginForm extends LoginFormMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  addEventListener<K extends keyof LoginFormEventMap>(
    type: K,
    listener: (this: LoginForm, ev: LoginFormEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof LoginFormEventMap>(
    type: K,
    listener: (this: LoginForm, ev: LoginFormEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-login-form': LoginForm;
  }
}

export { LoginForm };
