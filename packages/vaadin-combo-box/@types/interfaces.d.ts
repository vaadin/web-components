import { ComboBoxElement } from '../src/vaadin-combo-box.js';

export type ComboBoxItem = unknown;

export interface ComboBoxItemModel {
  index: number;
  item: ComboBoxItem | string;
}

export type ComboBoxRenderer = (
  root: HTMLElement,
  comboBox: ComboBoxElement,
  model: ComboBoxItemModel
) => void;

export type ComboBoxDataProviderCallback = (
  items: Array<ComboBoxItem | string>,
  size: number
) => void;

export interface ComboBoxDataProviderParams {
  page: number;
  pageSize: number;
  filter: string;
}

export type ComboBoxDataProvider = (
  params: ComboBoxDataProviderParams,
  callback: ComboBoxDataProviderCallback
) => void;
