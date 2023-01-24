import type { type ComboBoxElement, type ComboBoxItemModel } from '../generated/ComboBox.js';
import type { ReactModelRendererProps } from './useModelRenderer.js';

export type ComboBoxReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  ComboBoxItemModel<TItem>,
  ComboBoxElement<TItem>
>;
