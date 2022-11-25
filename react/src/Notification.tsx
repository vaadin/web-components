import { ComponentType, type ForwardedRef, forwardRef, type ReactElement, ReactNode } from 'react';
import {
  Notification as _Notification,
  type NotificationProps as _NotificationProps,
  WebComponentModule,
} from './generated/Notification.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export type NotificationReactRendererProps = ReactSimpleRendererProps<WebComponentModule.Notification>;

export type NotificationProps = Omit<_NotificationProps, 'children' | 'renderer'> &
  Readonly<{
    children?: ReactNode | ComponentType<NotificationReactRendererProps>;
    renderer?: ComponentType<NotificationReactRendererProps>;
  }>;

function Notification(
  { children, ...props }: NotificationProps,
  ref: ForwardedRef<WebComponentModule.Notification>,
): ReactElement | null {
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, children);

  return (
    <_Notification {...props} ref={ref} renderer={renderer}>
      {portals}
    </_Notification>
  );
}

const ForwardedNotification = forwardRef(Notification);

export { ForwardedNotification as Notification, WebComponentModule };
