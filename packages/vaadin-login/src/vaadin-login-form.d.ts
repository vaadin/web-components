import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { LoginMixin } from './vaadin-login-mixin.js';

import { LoginEventMap } from './interfaces';

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
 * The component doesn't have a shadowRoot, so the html form and input fields can be styled in an upper layer. To style
 * `vaadin-login-form-wrapper` check its documentation.
 *
 * @fires {CustomEvent} forgot-password - Fired when user clicks on the "Forgot password" button.
 * @fires {CustomEvent} login - Fired when a user submits the login.
 */
declare class LoginFormElement extends ElementMixin(ThemableMixin(LoginMixin(HTMLElement))) {
  submit(): void;

  addEventListener<K extends keyof LoginEventMap>(
    type: K,
    listener: (this: LoginFormElement, ev: LoginEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof LoginEventMap>(
    type: K,
    listener: (this: LoginFormElement, ev: LoginEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-login-form': LoginFormElement;
  }
}

export { LoginFormElement };
