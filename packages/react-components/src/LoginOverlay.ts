import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import {
  LoginOverlayElement,
  LoginOverlay as _LoginOverlay,
  type LoginOverlayProps as _LoginOverlayProps,
} from './generated/LoginOverlay.js';

export * from './generated/LoginOverlay.js';

type OmittedLoginOverlayHTMLAttributes = Omit<
  HTMLAttributes<LoginOverlayElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'children' | 'title'
>;

export type LoginOverlayProps = Partial<Omit<_LoginOverlayProps, keyof OmittedLoginOverlayHTMLAttributes>>;

export const LoginOverlay = _LoginOverlay as (
  props: LoginOverlayProps & RefAttributes<LoginOverlayElement>,
) => ReactElement | null;
