import { ComboBoxElement } from './vaadin-combo-box';

export type ComboBoxDefaultItem = any;

export interface ComboBoxItemModel<TItem> {
  index: number;
  item: TItem;
}

export type ComboBoxRenderer<TItem> = (
  root: HTMLElement,
  comboBox: ComboBoxElement<TItem>,
  model: ComboBoxItemModel<TItem>
) => void;

export type ComboBoxDataProviderCallback<TItem> = (items: Array<TItem>, size: number) => void;

export interface ComboBoxDataProviderParams {
  page: number;
  pageSize: number;
  filter: string;
}

export type ComboBoxDataProvider<TItem> = (
  params: ComboBoxDataProviderParams,
  callback: ComboBoxDataProviderCallback<TItem>
) => void;

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
export type ComboBoxSelectedItemChangedEvent<TItem> = CustomEvent<{ value: TItem | null | undefined }>;

export interface ComboBoxEventMap<TItem> extends HTMLElementEventMap {
  'custom-value-set': ComboBoxCustomValueSetEvent;

  'opened-changed': ComboBoxOpenedChangedEvent;

  'filter-changed': ComboBoxFilterChangedEvent;

  'invalid-changed': ComboBoxInvalidChangedEvent;

  'value-changed': ComboBoxValueChangedEvent;

  'selected-item-changed': ComboBoxSelectedItemChangedEvent<TItem>;
}
