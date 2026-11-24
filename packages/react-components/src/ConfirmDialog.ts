/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import {
  ConfirmDialog as _ConfirmDialog,
  type ConfirmDialogElement,
  type ConfirmDialogProps as _ConfirmDialogProps,
} from './generated/ConfirmDialog.js';

export * from './generated/ConfirmDialog.js';

type OmittedConfirmDialogHTMLAttributes = Omit<
  HTMLAttributes<ConfirmDialogElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'children' | 'aria-label' | 'aria-labelledby'
>;

export type ConfirmDialogProps = Partial<Omit<_ConfirmDialogProps, keyof OmittedConfirmDialogHTMLAttributes>>;

export const ConfirmDialog = _ConfirmDialog as (
  props: ConfirmDialogProps & RefAttributes<ConfirmDialogElement>,
) => ReactElement | null;
