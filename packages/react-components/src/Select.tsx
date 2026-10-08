/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  isValidElement,
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

type SelectRenderer = ComponentType<SelectReactRendererProps>;

export type SelectProps = Partial<Omit<_SelectProps, 'children' | 'renderer'>> &
  Readonly<{
    children?: ReactNode | SelectRenderer | Array<ReactNode | SelectRenderer>;
    renderer?: SelectRenderer | null;
  }>;

function Select(props: SelectProps, ref: ForwardedRef<SelectElement>): ReactElement | null {
  // React.Children.toArray() doesn't allow functions, so we convert manually.
  const children = Array.isArray(props.children) ? props.children : [props.children];

  // Components with slot attribute should stay in light DOM.
  const slottedChildren = children.filter((child): child is ReactNode => {
    return isValidElement(child) && (child.props as any).slot;
  });

  // Component without slot attribute should go to the overlay.
  const overlayChildren = children.filter((child): child is ReactNode => {
    return isValidElement(child) && !slottedChildren.includes(child);
  });

  const renderFn = children.find((child) => typeof child === 'function');

  const innerRef = useRef<SelectElement>(null);
  const [portals, renderer] = useSimpleOrChildrenRenderer(
    props.renderer,
    renderFn || (overlayChildren.length ? overlayChildren : undefined),
  );
  const finalRef = useMergedRefs(innerRef, ref);

  useEffect(() => {
    if (props.renderer || props.children) {
      innerRef.current?.requestContentUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run when the element mounts, kept from the source
  }, [innerRef.current, props.renderer, props.children]);

  return (
    <_Select {...props} ref={finalRef} renderer={renderer}>
      {slottedChildren}
      {portals}
    </_Select>
  );
}

const ForwardedSelect = forwardRef(Select);

export { ForwardedSelect as Select };
