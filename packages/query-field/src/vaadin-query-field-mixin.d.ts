/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';

export type QueryFieldFilterOption = {
  value: string;
  label?: string;
};

export type QueryFieldFilter = {
  /**
   * The filter name typed before the colon: `name:value`.
   */
  name: string;
  /**
   * Human-readable label, shown in suggestions.
   */
  label?: string;
  /**
   * The value type, `'number'` requires a numeric value. Defaults to `'text'`.
   */
  type?: 'number' | 'text';
  /**
   * Allowed values, suggested while typing the value.
   */
  options?: Array<QueryFieldFilterOption | string>;
  /**
   * When true, values that are not in `options` are accepted.
   */
  allowCustomValue?: boolean;
};

export type QueryFieldQuery = {
  text: string;
  filters: Array<{ name: string; value: string }>;
};

/**
 * A mixin providing the query parsing, highlighting and autocomplete logic of `<vaadin-query-field>`.
 */
export declare function QueryFieldMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ClearButtonMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputControlMixinClass> &
  Constructor<InputFieldMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<QueryFieldMixinClass> &
  Constructor<SlotStylesMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class QueryFieldMixinClass {
  /**
   * The filters that can be used in the query. Each filter is typed as
   * `name:value` (or `name:"some value"`) and has the following shape:
   *
   * - `name` — the filter name typed before the colon.
   * - `label` — optional human-readable label, shown in suggestions.
   * - `type` — optional, `'number'` requires a numeric value. Defaults to `'text'`.
   * - `options` — optional array of allowed values, suggested while typing the value.
   *   Each option is either a string, or an object with `value` and optional `label`.
   * - `allowCustomValue` — optional, when true, values that are not in `options` are accepted.
   */
  filters: QueryFieldFilter[];

  /**
   * The parsed query: an object with the free `text` (all words that are not
   * filters, joined by a single space), and the list of valid `filters` as
   * `{ name, value }` objects. Invalid filters are not included.
   */
  readonly query: QueryFieldQuery;
}
