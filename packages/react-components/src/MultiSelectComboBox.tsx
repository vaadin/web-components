import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, forwardRef, type ReactElement, type RefAttributes, type ForwardedRef } from 'react';
import {
  MultiSelectComboBox as _MultiSelectComboBox,
  type MultiSelectComboBoxElement,
  type MultiSelectComboBoxProps as _MultiSelectComboBoxProps,
} from './generated/MultiSelectComboBox.js';
import type { MultiSelectComboBoxReactRendererProps } from './renderers/multiSelectCombobox.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/MultiSelectComboBox.js';

export type MultiSelectComboBoxProps<TItem> = Partial<Omit<_MultiSelectComboBoxProps<TItem>, 'renderer'>> &
  Readonly<{
    renderer?: ComponentType<MultiSelectComboBoxReactRendererProps<TItem>> | null;
  }>;

function MultiSelectComboBox<TItem = ComboBoxDefaultItem>(
  props: MultiSelectComboBoxProps<TItem>,
  ref: ForwardedRef<MultiSelectComboBoxElement<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer);

  return (
    <_MultiSelectComboBox<TItem> {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_MultiSelectComboBox>
  );
}

const ForwardedMultiSelectComboBox = forwardRef(MultiSelectComboBox) as <TItem = ComboBoxDefaultItem>(
  props: MultiSelectComboBoxProps<TItem> & RefAttributes<MultiSelectComboBoxElement<TItem>>,
) => ReactElement | null;

export { ForwardedMultiSelectComboBox as MultiSelectComboBox };
