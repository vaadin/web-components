import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type ReactNode } from 'react';
import { Dialog as _Dialog, WebComponentModule, type DialogProps as _DialogProps } from './generated/Dialog.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export type DialogReactRendererProps = ReactSimpleRendererProps<WebComponentModule.Dialog>;

export type DialogProps = Omit<_DialogProps, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'> &
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
  ref: ForwardedRef<WebComponentModule.Dialog>,
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

export { ForwardedDialog as Dialog, WebComponentModule };
