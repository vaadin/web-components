import {
  type ComponentType,
  type ForwardedRef,
  type HTMLAttributes,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Popover as _Popover, type PopoverElement, type PopoverProps as _PopoverProps } from './generated/Popover.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
import { issueWarning } from './utils/warnings.js';

export * from './generated/Popover.js';

export type PopoverReactRendererProps = ReactSimpleRendererProps<PopoverElement>;

type OmittedPopoverHTMLAttributes = Omit<
  HTMLAttributes<PopoverElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot'
>;

export type PopoverProps = Partial<Omit<_PopoverProps, 'children' | 'renderer' | keyof OmittedPopoverHTMLAttributes>> &
  Readonly<{
    children?: ReactNode | ComponentType<PopoverReactRendererProps>;
    /**
     * @deprecated Pass children directly to the popover instead
     */
    renderer?: ComponentType<PopoverReactRendererProps> | null;
  }>;

function Popover({ children, ...props }: PopoverProps, ref: ForwardedRef<PopoverElement>): ReactElement | null {
  if (props.renderer) {
    issueWarning('<Popover>: Using the renderer prop is deprecated. Pass children directly to the component instead.');
  }
  if (typeof children === 'function') {
    issueWarning(
      '<Popover>: Passing a component type as children is deprecated. Pass children directly to the component instead.',
    );
  }

  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, children);

  return (
    <_Popover {...props} ref={ref} renderer={renderer}>
      {portals}
    </_Popover>
  );
}

const ForwardedPopover = forwardRef(Popover);

export { ForwardedPopover as Popover };
