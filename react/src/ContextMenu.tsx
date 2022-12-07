import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ContextMenu as _ContextMenu,
  type ContextMenuProps as _ContextMenuProps,
  WebComponentModule,
} from './generated/ContextMenu.js';
import { type ReactContextRendererProps, useContextRenderer } from './renderers/useContextRenderer.js';

export * from './generated/ContextMenu.js';

export type ContextMenuReactRendererProps = ReactContextRendererProps<
  WebComponentModule.ContextMenuRendererContext,
  WebComponentModule.ContextMenu
>;

// The 'opened' property is omitted because it is readonly in the web component.
// So you cannot set it up manually, only read from the component.
// For changing the property, use specific methods of the component.
export type ContextMenuProps = Omit<_ContextMenuProps, 'opened' | 'renderer'> &
  Readonly<{
    renderer?: ComponentType<ContextMenuReactRendererProps> | null;
  }>;

function ContextMenu(props: ContextMenuProps, ref: ForwardedRef<WebComponentModule.ContextMenu>): ReactElement | null {
  const [portals, renderer] = useContextRenderer(props.renderer);

  return (
    <_ContextMenu {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_ContextMenu>
  );
}

const ForwardedContextMenu = forwardRef(ContextMenu);

export { ForwardedContextMenu as ContextMenu, WebComponentModule };
