import { ComboBoxElement } from '../src/vaadin-combo-box.js';

export type ComboBoxItem = unknown;

export interface ComboBoxItemModel {
  index: number;
  item: ComboBoxItem | string;
}

export type ComboBoxRenderer = (root: HTMLElement, comboBox: ComboBoxElement, model: ComboBoxItemModel) => void;

export type ComboBoxDataProviderCallback = (items: Array<ComboBoxItem | string>, size: number) => void;

export interface ComboBoxDataProviderParams {
  page: number;
  pageSize: number;
  filter: string;
}

export type ComboBoxDataProvider = (params: ComboBoxDataProviderParams, callback: ComboBoxDataProviderCallback) => void;

/**
 * Fired when the user sets a custom value.
 */
export type ComboBoxCustomValueSetEvent = CustomEvent<string>;

/**
 * Fired when the `opened` property changes.
 */
export type ComboBoxOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type ComboBoxInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type ComboBoxValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `filter` property changes.
 */
export type ComboBoxFilterChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `selectedItem` property changes.
 */
export type ComboBoxSelectedItemChangedEvent<T> = CustomEvent<{ value: T }>;

export interface ComboBoxElementEventMap {
  'custom-value-set': ComboBoxCustomValueSetEvent;

  'opened-changed': ComboBoxOpenedChangedEvent;

  'filter-changed': ComboBoxFilterChangedEvent;

  'invalid-changed': ComboBoxInvalidChangedEvent;

  'value-changed': ComboBoxValueChangedEvent;

  'selected-item-changed': ComboBoxSelectedItemChangedEvent<any>;
}

export interface ComboBoxEventMap extends HTMLElementEventMap, ComboBoxElementEventMap {}
