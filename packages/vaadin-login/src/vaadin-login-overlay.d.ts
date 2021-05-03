import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { LoginMixin } from './vaadin-login-mixin.js';

import { LoginEventMap } from './interfaces';

/**
 * `<vaadin-login-overlay>` is a wrapper of the `<vaadin-login-form>` which opens a login form in an overlay and
 * having an additional `brand` part for application title and description. Using `<vaadin-login-overlay>` allows
 * password managers to work with login form.
 *
 * ```
 * <vaadin-login-overlay opened></vaadin-login-overlay>
 * ```
 *
 * ### Styling
 *
 * The component doesn't have a shadowRoot, so the `<form>` and input fields can be styled from a global scope.
 * Use `<vaadin-login-overlay-wrapper>` and `<vaadin-login-form-wrapper>` to apply styles.
 *
 * The following Shadow DOM parts of the `<vaadin-login-overlay-wrapper>` are available for styling:
 *
 * Part name       | Description
 * ----------------|---------------------------------------------------------|
 * `card`          | Container for the entire component's content
 * `brand`         | Container for application title and description
 * `form`          | Container for the `<vaadin-login-form>` component
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * See [`<vaadin-login-form>`](#/elements/vaadin-login-form)
 * documentation for  `<vaadin-login-form-wrapper>` stylable parts.
 *
 * @fires {CustomEvent} forgot-password - Fired when user clicks on the "Forgot password" button.
 * @fires {CustomEvent} login - Fired when a user submits the login.
 */
declare class LoginOverlayElement extends ElementMixin(ThemableMixin(LoginMixin(HTMLElement))) {
  /**
   * Defines the application description
   */
  description: string;

  /**
   * True if the overlay is currently displayed.
   */
  opened: boolean;

  /**
   * Defines the application title
   */
  title: string;

  addEventListener<K extends keyof LoginEventMap>(
    type: K,
    listener: (this: LoginOverlayElement, ev: LoginEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof LoginEventMap>(
    type: K,
    listener: (this: LoginOverlayElement, ev: LoginEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-login-overlay': LoginOverlayElement;
  }
}

export { LoginOverlayElement };
