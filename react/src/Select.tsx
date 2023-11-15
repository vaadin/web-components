import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { Select as _Select, type SelectElement, type SelectProps as _SelectProps } from './generated/Select.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
import useMergedRefs from './utils/useMergedRefs.js';

export * from './generated/Select.js';

export type SelectReactRendererProps = ReactSimpleRendererProps<SelectElement>;

export type SelectProps = Partial<Omit<_SelectProps, 'children' | 'renderer'>> &
  Readonly<{
    children?: ReactNode | ComponentType<SelectReactRendererProps>;
    renderer?: ComponentType<SelectReactRendererProps> | null;
  }>;

function Select(props: SelectProps, ref: ForwardedRef<SelectElement>): ReactElement | null {
  const innerRef = useRef<SelectElement>(null);
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, props.children);
  const finalRef = useMergedRefs(innerRef, ref);

  useEffect(() => {
    if (props.renderer || props.children) {
      innerRef.current?.requestContentUpdate();
    }
  }, [innerRef.current, props.renderer, props.children]);

  return (
    <_Select {...props} ref={finalRef} renderer={renderer}>
      {portals}
    </_Select>
  );
}

const ForwardedSelect = forwardRef(Select);

export { ForwardedSelect as Select };
