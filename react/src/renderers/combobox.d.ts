import type { ComboBoxModule } from '../generated/index.js';
import type { ReactModelRendererProps } from "./useModelRenderer.js";

export type ComboBoxReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  ComboBoxModule.ComboBoxItemModel<TItem>,
  ComboBoxModule.ComboBox<TItem>
>;
