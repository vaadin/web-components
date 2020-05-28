import { ComboBoxElement } from '../src/vaadin-combo-box.js';

export type ComboBoxItem = string | { [key: string]: unknown };

export interface ComboBoxRendererModel {
  index: number;
  item: ComboBoxItem;
}

export type ComboBoxRenderer = (
  root: HTMLElement,
  comboBox: ComboBoxElement,
  model: ComboBoxRendererModel
) => void;

export type ComboBoxDataProviderCallback = (
  items: Array<ComboBoxItem>,
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
