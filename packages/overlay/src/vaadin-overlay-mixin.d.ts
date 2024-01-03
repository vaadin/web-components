/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { OverlayFocusMixinClass } from './vaadin-overlay-focus-mixin.js';
import type { OverlayStackMixinClass } from './vaadin-overlay-stack-mixin.js';

export type OverlayRenderer = (root: HTMLElement, owner: HTMLElement, model?: object) => void;

export declare function OverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> &
  Constructor<OverlayFocusMixinClass> &
  Constructor<OverlayMixinClass> &
  Constructor<OverlayStackMixinClass> &
  T;

export declare class OverlayMixinClass {
  /**
   * Owner element passed with renderer function
   */
  owner: HTMLElement | null;

  /**
   * Custom function for rendering the content of the overlay.
   * Receives three arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `owner` The host element of the renderer function.
   * - `model` The object with the properties related with rendering.
   */
  renderer: OverlayRenderer | null | undefined;

  /**
   * When true the overlay has backdrop on top of content when opened.
   */
  withBackdrop: boolean;

  /**
   * Object with properties that is passed to `renderer` function
   */
  model: object | null | undefined;

  /**
   * When true, the overlay is visible and attached to body.
   */
  opened: boolean | null | undefined;

  /**
   * When true the overlay won't disable the main content, showing
   * it doesn't change the functionality of the user interface.
   */
  modeless: boolean;

  /**
   * When set to true, the overlay is hidden. This also closes the overlay
   * immediately in case there is a closing animation in progress.
   */
  hidden: boolean;

  close(sourceEvent?: Event | null): void;

  /**
   * Requests an update for the content of the overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  protected _flushAnimation(type: 'closing' | 'opening'): void;

  /**
   * Whether to close the overlay on outside click or not.
   * Override this method to customize the closing logic.
   */
  protected _shouldCloseOnOutsideClick(event: Event): boolean;
}
