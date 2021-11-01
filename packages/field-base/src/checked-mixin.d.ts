/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateHost } from './delegate-state-mixin.js';
import { InputHost } from './input-mixin.js';

export declare class CheckedHost {
  /**
   * True if the element is checked.
   */
  checked: boolean;

  protected _toggleChecked(checked: boolean): void;
}

/**
 * A mixin to manage the checked state.
 */
export declare function CheckedMixin<T extends Constructor<object>>(
  base: T
): T &
  Constructor<CheckedHost> &
  Pick<typeof CheckedHost, keyof typeof CheckedHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<InputHost> &
  Pick<typeof InputHost, keyof typeof InputHost> &
  Constructor<DelegateStateHost> &
  Pick<typeof DelegateStateHost, keyof typeof DelegateStateHost>;
