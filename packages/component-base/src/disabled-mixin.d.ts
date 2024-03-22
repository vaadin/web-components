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

/**
 * A mixin to provide disabled property for field components.
 */
export declare function DisabledMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<DisabledMixinClass> & T;

export declare class DisabledMixinClass {
  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;

  protected _disabledChanged(disabled: boolean, oldDisabled: boolean): void;
}
