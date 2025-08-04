/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginFormMixin } from './vaadin-login-form-mixin.js';
import { LoginOverlayMixin } from './vaadin-login-overlay-mixin.js';

export { LoginI18n } from './vaadin-login-mixin.js';

/**
 * Fired when the `description` property changes.
 */
export type LoginOverlayDescriptionChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `disabled` property changes.
 */
export type LoginOverlayDisabledChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `error` property changes.
 */
export type LoginOverlayErrorChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when a user submits the login.
 */
export type LoginOverlayLoginEvent = CustomEvent<{
  username: string;
  password: string;
  custom?: Record<string, unknown>;
}>;

/**
 * Fired when the overlay is closed.
 */
export type LoginOverlayClosedEvent = CustomEvent;

export interface LoginOverlayCustomEventMap {
  'description-changed': LoginOverlayDescriptionChangedEvent;

  'disabled-changed': LoginOverlayDisabledChangedEvent;

  'error-changed': LoginOverlayErrorChangedEvent;

  'forgot-password': Event;

  login: LoginOverlayLoginEvent;

  closed: LoginOverlayClosedEvent;
}

export interface LoginOverlayEventMap extends HTMLElementEventMap, LoginOverlayCustomEventMap {}

/**
 * `<vaadin-login-overlay>` is a web component which renders a login form in an overlay and
 * provides an additional `brand` part for application title and description.
 *
 * ```html
 * <vaadin-login-overlay opened></vaadin-login-overlay>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name                    | Description
 * -----------------------------|--------------------------------
 * `backdrop`                   | Backdrop of the overlay
 * `overlay`                    | The overlay container element
 * `content`                    | The overlay content element
 * `card`                       | Container for the brand and form wrapper
 * `brand`                      | Container for application title and description
 * `description`                | The application description
 * `form-wrapper`               | The login form wrapper element
 * `form`                       | The login form element
 * `form-title`                 | Title of the login form
 * `error-message`              | Container for error message
 * `error-message-title`        | Container for error message title
 * `error-message-description`  | Container for error message description
 * `footer`                     | Container for the footer element
 *
 * @fires {CustomEvent} description-changed - Fired when the `description` property changes.
 * @fires {CustomEvent} disabled-changed - Fired when the `disabled` property changes.
 * @fires {CustomEvent} error-changed - Fired when the `error` property changes.
 * @fires {CustomEvent} forgot-password - Fired when user clicks on the "Forgot password" button.
 * @fires {CustomEvent} login - Fired when a user submits the login.
 * @fires {CustomEvent} closed - Fired when the overlay is closed.
 */
declare class LoginOverlay extends LoginFormMixin(LoginOverlayMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  addEventListener<K extends keyof LoginOverlayEventMap>(
    type: K,
    listener: (this: LoginOverlay, ev: LoginOverlayEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof LoginOverlayEventMap>(
    type: K,
    listener: (this: LoginOverlay, ev: LoginOverlayEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-login-overlay': LoginOverlay;
  }
}

export { LoginOverlay };
