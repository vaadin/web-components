import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { Dialog as _Dialog, DialogModule, type DialogProps as _DialogProps } from './generated/Dialog.js';
import { type ReactSimpleRendererProps, useSimpleRenderer } from "./renderers/useSimpleRenderer.js";

export type DialogReactRendererProps = ReactSimpleRendererProps<DialogModule.Dialog>;

export type DialogProps = Omit<_DialogProps, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<DialogReactRendererProps>;
  }>;

function Dialog(props: DialogProps, ref: ForwardedRef<DialogModule.Dialog>): ReactElement | null {
  const [portals, renderer] = useSimpleRenderer(props.renderer);

  return (
    <_Dialog
      {...props}
      ref={ref}
      renderer={renderer}
    >
      {props.children}
      {portals}
    </_Dialog>
  );
}

const ForwardedDialog = forwardRef(Dialog);

export { ForwardedDialog as Dialog, DialogModule };
