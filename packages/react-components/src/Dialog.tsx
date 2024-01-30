import {
  type ComponentType,
  type ForwardedRef,
  type HTMLAttributes,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Dialog as _Dialog, type DialogElement, type DialogProps as _DialogProps } from './generated/Dialog.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export * from './generated/Dialog.js';

export type DialogReactRendererProps = ReactSimpleRendererProps<DialogElement>;

type OmittedDialogHTMLAttributes = Omit<
  HTMLAttributes<DialogElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'aria-label' | 'draggable'
>;

export type DialogProps = Partial<
  Omit<_DialogProps, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedDialogHTMLAttributes>
> &
  Readonly<{
    children?: ReactNode | ComponentType<DialogReactRendererProps>;
    footer?: ReactNode;
    footerRenderer?: ComponentType<DialogReactRendererProps> | null;
    header?: ReactNode;
    headerRenderer?: ComponentType<DialogReactRendererProps> | null;
    renderer?: ComponentType<DialogReactRendererProps> | null;
  }>;

function Dialog(
  { children, footer, header, ...props }: DialogProps,
  ref: ForwardedRef<DialogElement>,
): ReactElement | null {
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer);
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header);
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, children);

  return (
    <_Dialog {...props} ref={ref} footerRenderer={footerRenderer} headerRenderer={headerRenderer} renderer={renderer}>
      {headerPortals}
      {footerPortals}
      {portals}
    </_Dialog>
  );
}

const ForwardedDialog = forwardRef(Dialog);

export { ForwardedDialog as Dialog };
