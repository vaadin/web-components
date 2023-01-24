import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ForwardRefExoticComponent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import {
  Notification as _Notification,
  NotificationElement,
  type NotificationProps as _NotificationProps,
  type ShowOptions,
} from './generated/Notification.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export * from './generated/Notification.js';

export type NotificationReactRendererProps = ReactSimpleRendererProps<NotificationElement>;

export type NotificationProps = Partial<Omit<_NotificationProps, 'children' | 'renderer'>> &
  Readonly<{
    children?: ReactNode | ComponentType<NotificationReactRendererProps>;
    renderer?: ComponentType<NotificationReactRendererProps>;
  }>;

function Notification(
  { children, ...props }: NotificationProps,
  ref: ForwardedRef<NotificationElement>,
): ReactElement | null {
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, children);

  return (
    <_Notification {...props} ref={ref} renderer={renderer}>
      {portals}
    </_Notification>
  );
}

export type NotificationFunction = ForwardRefExoticComponent<NotificationProps & RefAttributes<NotificationElement>> & {
  show(contents: string, options?: ShowOptions): NotificationElement;
};

const ForwardedNotification = forwardRef(Notification) as NotificationFunction;
ForwardedNotification.show = NotificationElement.show;

export { ForwardedNotification as Notification };
