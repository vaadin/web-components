import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type ReactNode } from 'react';
import { Select as _Select, type SelectElement, type SelectProps as _SelectProps } from './generated/Select.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export * from './generated/Select.js';

export type SelectReactRendererProps = ReactSimpleRendererProps<SelectElement>;

export type SelectProps = Partial<Omit<_SelectProps, 'children' | 'renderer'>> &
  Readonly<{
    children?: ReactNode | ComponentType<SelectReactRendererProps>;
    renderer?: ComponentType<SelectReactRendererProps> | null;
  }>;

function Select(props: SelectProps, ref: ForwardedRef<SelectElement>): ReactElement | null {
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, props.children);

  return (
    <_Select {...props} ref={ref} renderer={renderer}>
      {portals}
    </_Select>
  );
}

const ForwardedSelect = forwardRef(Select);

export { ForwardedSelect as Select };
