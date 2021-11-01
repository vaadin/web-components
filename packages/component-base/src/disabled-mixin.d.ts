/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare class DisabledHost {
  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;

  protected _disabledChanged(disabled: boolean, oldDisabled: boolean): void;
}

/**
 * A mixin to provide disabled property for field components.
 */
export declare function DisabledMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T & Constructor<DisabledHost> & Pick<typeof DisabledHost, keyof typeof DisabledHost>;
