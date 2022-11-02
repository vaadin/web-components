import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { ComboBox as _ComboBox, ComboBoxModule, type ComboBoxProps as _ComboBoxProps } from './generated/ComboBox.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
import { useModelRenderer } from "./renderers/useModelRenderer.js";

export type ComboBoxProps<TItem> = Omit<_ComboBoxProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
  }>;

function ComboBox<TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem>,
  ref: ForwardedRef<ComboBoxModule.ComboBox<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer);

  return (
    <_ComboBox<TItem> {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_ComboBox>
  );
}

const ForwardedComboBox = forwardRef(ComboBox) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem> & { ref?: ForwardedRef<ComboBoxModule.ComboBox<TItem>> },
) => ReactElement | null;

export { ForwardedComboBox as ComboBox, ComboBoxModule };
