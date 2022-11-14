import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  Notification as _Notification,
  NotificationModule,
  type NotificationProps as _NotificationProps,
} from './generated/Notification.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export type NotificationReactRendererProps = ReactSimpleRendererProps<NotificationModule.Notification>;

export type NotificationProps = Omit<_NotificationProps, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<NotificationReactRendererProps>;
  }>;

function Notification(
  { children, ...props }: NotificationProps,
  ref: ForwardedRef<NotificationModule.Notification>,
): ReactElement | null {
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, children);

  return (
    <_Notification {...props} ref={ref} renderer={renderer}>
      {portals}
    </_Notification>
  );
}

const ForwardedNotification = forwardRef(Notification);

export { ForwardedNotification as Notification, NotificationModule };
