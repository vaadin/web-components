/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import {
  LoginOverlay as _LoginOverlay,
  type LoginOverlayElement,
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
