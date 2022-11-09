import type { NotificationRenderer } from '@vaadin/notification';
import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  Notification as _Notification,
  NotificationModule,
  type NotificationProps as _NotificationProps,
} from './generated/Notification.js';
import { useSimpleRenderer, type ReactSimpleRendererProps} from './renderers/useSimpleRenderer.js';

export type NotificationReactRendererProps = ReactSimpleRendererProps<NotificationModule.Notification>;

export type NotificationProps = Omit<_NotificationProps, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<NotificationReactRendererProps>;
  }>;

function Notification(
  props: NotificationProps,
  ref: ForwardedRef<NotificationModule.Notification>,
): ReactElement | null {
  const [portals, renderer] = useSimpleRenderer(props.renderer);

  return (
    <_Notification
      {...props}
      ref={ref}
      renderer={renderer}
    >
      {props.children}
      {portals}
    </_Notification>
  );
}

const ForwardedNotification = forwardRef(Notification);

export { ForwardedNotification as Notification, NotificationModule };
