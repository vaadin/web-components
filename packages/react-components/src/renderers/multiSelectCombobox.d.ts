import type { type ComboBoxItemModel } from '../generated/ComboBox.js';
import type { type MultiSelectComboBoxElement } from '../generated/MultiSelectComboBox.js';
import type { ReactModelRendererProps } from './useModelRenderer.js';

export type MultiSelectComboBoxReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  ComboBoxItemModel<TItem>,
  MultiSelectComboBoxElement<TItem>
>;
