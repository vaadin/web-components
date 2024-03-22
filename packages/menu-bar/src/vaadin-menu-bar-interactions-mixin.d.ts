/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import type { KeyboardDirectionMixinClass } from '@vaadin/component-base/src/keyboard-direction-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';

export declare function InteractionsMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<FocusMixinClass> &
  Constructor<InteractionsMixinClass> &
  Constructor<KeyboardDirectionMixinClass> &
  Constructor<KeyboardMixinClass> &
  T;

export declare class InteractionsMixinClass {
  /**
   * If true, the submenu will open on hover (mouseover) instead of click.
   * @attr {boolean} open-on-hover
   */
  openOnHover: boolean | null | undefined;

  /**
   * @deprecated Since Vaadin 23, `notifyResize()` is deprecated. The component uses a
   * ResizeObserver internally and doesn't need to be explicitly notified of resizes.
   */
  notifyResize(): void;
}
