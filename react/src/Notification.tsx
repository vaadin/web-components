import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
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

export type NotificationFunction = ForwardRefExoticComponent<
  PropsWithoutRef<NotificationProps> & RefAttributes<WebComponentModule.Notification>
> & {
  show(contents: string, options?: WebComponentModule.ShowOptions): WebComponentModule.Notification;
};

const ForwardedNotification = forwardRef(Notification) as NotificationFunction;
ForwardedNotification.show = WebComponentModule.Notification.show;

export { ForwardedNotification as Notification, WebComponentModule };
