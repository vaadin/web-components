/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateHost } from './delegate-state-mixin.js';
import { InputConstraintsHost } from './input-constraints-mixin.js';
import { InputHost } from './input-mixin.js';
import { ValidateHost } from './validate-mixin.js';

export declare class PatternHost {
  /**
   * A regular expression that the value is checked against.
   * The pattern must match the entire value, not just some subset.
   */
  pattern: string;

  /**
   * When set to true, user is prevented from typing a value that
   * conflicts with the given `pattern`.
   * @attr {boolean} prevent-invalid-input
   */
  preventInvalidInput: boolean | null | undefined;
}

/**
 * A mixin to provide `pattern` and `preventInvalidInput` properties.
 */
export declare function PatternMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<PatternHost> &
  Pick<typeof PatternHost, keyof typeof PatternHost> &
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
