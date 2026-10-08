/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ComboBoxElement, ComboBoxItemModel } from '../generated/ComboBox.js';
import type { ReactModelRendererProps } from './useModelRenderer.js';

export type ComboBoxReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  ComboBoxItemModel<TItem>,
  ComboBoxElement<TItem>
>;
