/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateHost } from './delegate-state-mixin.js';
import { InputHost } from './input-mixin.js';
import { ValidateHost } from './validate-mixin.js';

export declare class InputConstraintsHost {
  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}

/**
 * A mixin to combine multiple input validation constraints.
 */
export declare function InputConstraintsMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<InputConstraintsHost> &
  Pick<typeof InputConstraintsHost, keyof typeof InputConstraintsHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<InputHost> &
  Pick<typeof InputHost, keyof typeof InputHost> &
  Constructor<DelegateStateHost> &
  Pick<typeof DelegateStateHost, keyof typeof DelegateStateHost> &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost>;
