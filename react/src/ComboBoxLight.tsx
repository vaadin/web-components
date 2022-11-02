import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from "react";
import {
  ComboBoxLight as _ComboBoxLight,
  ComboBoxLightModule,
  type ComboBoxLightProps as _ComboBoxLightProps,
} from './generated/ComboBoxLight.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
import { useModelRenderer } from "./renderers/useModelRenderer.js";

export type ComboBoxLightProps<TItem> = Omit<_ComboBoxLightProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
  }>;

function ComboBoxLight<TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem>,
  ref: ForwardedRef<ComboBoxLightModule.ComboBoxLight<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer);

  return (
    <_ComboBoxLight<TItem> {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_ComboBoxLight>
  );
}

const ForwardedComboBoxLight = forwardRef(ComboBoxLight) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem> & { ref?: ForwardedRef<ComboBoxLightModule.ComboBoxLight<TItem>> },
) => ReactElement | null;

export { ForwardedComboBoxLight as ComboBoxLight, ComboBoxLightModule };
