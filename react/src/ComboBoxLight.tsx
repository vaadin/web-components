import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ComboBoxLight as _ComboBoxLight,
  type ComboBoxLightProps as _ComboBoxLightProps,
  WebComponentModule,
} from './generated/ComboBoxLight.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/ComboBoxLight.js';

export type ComboBoxLightProps<TItem> = Omit<_ComboBoxLightProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
  }>;

function ComboBoxLight<TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem>,
  ref: ForwardedRef<WebComponentModule.ComboBoxLight<TItem>>,
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
  props: ComboBoxLightProps<TItem> & { ref?: ForwardedRef<WebComponentModule.ComboBoxLight<TItem>> },
) => ReactElement | null;

export { ForwardedComboBoxLight as ComboBoxLight, WebComponentModule };
