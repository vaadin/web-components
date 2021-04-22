import {
  ComboBoxCustomValueSetEvent,
  ComboBoxFilterChangedEvent,
  ComboBoxInvalidChangedEvent,
  ComboBoxOpenedChangedEvent,
  ComboBoxSelectedItemChangedEvent,
  ComboBoxValueChangedEvent
} from './interfaces.js';

/**
 * @deprecated Please use `ComboBoxCustomValueSetEvent` instead.
 */
export type ComboBoxCustomValueSet = ComboBoxCustomValueSetEvent;

/**
 * @deprecated Please use `ComboBoxOpenedChangedEvent` instead.
 */
export type ComboBoxOpenedChanged = ComboBoxOpenedChangedEvent;

/**
 * @deprecated Please use `ComboBoxInvalidChangedEvent` instead.
 */
export type ComboBoxInvalidChanged = ComboBoxInvalidChangedEvent;

/**
 * @deprecated Please use `ComboBoxValueChangedEvent` instead.
 */
export type ComboBoxValueChanged = ComboBoxValueChangedEvent;

/**
 * @deprecated Please use `ComboBoxFilterChangedEvent` instead.
 */
export type ComboBoxFilterChanged = ComboBoxFilterChangedEvent;

/**
 * @deprecated Please use `ComboBoxSelectedItemChangedEvent` instead.
 */
export type ComboBoxSelectedItemChanged<T> = ComboBoxSelectedItemChangedEvent<T>;
