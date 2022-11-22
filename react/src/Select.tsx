import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { Select as _Select, WebComponentModule, type SelectProps as _SelectProps } from './generated/Select.js';
import { useSimpleRenderer, type ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export type SelectReactRendererProps = ReactSimpleRendererProps<WebComponentModule.Select>;

export type SelectProps = Omit<_SelectProps, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<SelectReactRendererProps> | null;
  }>;

function Select(props: SelectProps, ref: ForwardedRef<WebComponentModule.Select>): ReactElement | null {
  const [portals, renderer] = useSimpleRenderer(props.renderer);

  return (
    <_Select
      {...props}
      ref={ref}
      // TODO: remove cast after the nullability issue is fixed
      renderer={renderer as WebComponentModule.SelectRenderer}
    >
      {props.children}
      {portals}
    </_Select>
  );
}

const ForwardedSelect = forwardRef(Select);

export { ForwardedSelect as Select, WebComponentModule };
