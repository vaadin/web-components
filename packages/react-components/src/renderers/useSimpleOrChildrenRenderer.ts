/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ComponentType, ReactNode } from 'react';
import type { RendererConfig, UseRendererResult } from './useRenderer.js';
import { useRenderer } from './useRenderer.js';
import {
  type ReactSimpleRendererProps,
  useSimpleRenderer,
  type WebComponentSimpleRenderer,
} from './useSimpleRenderer.js';

export function useSimpleOrChildrenRenderer<O extends HTMLElement>(
  fnRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null,
  children?: ReactNode | ComponentType<ReactSimpleRendererProps<O>>,
  config?: RendererConfig<WebComponentSimpleRenderer<O>>,
): UseRendererResult<WebComponentSimpleRenderer<O>> {
  let _children: ReactNode | undefined;
  let _fnRenderer: ComponentType<ReactSimpleRendererProps<O>> | null | undefined;
  let shouldUseSimpleRendererResult = false;

  if (typeof children === 'function') {
    _children = undefined;
    _fnRenderer = children;
    shouldUseSimpleRendererResult = true;
  } else {
    _children = children;
    _fnRenderer = fnRenderer;
    shouldUseSimpleRendererResult = !!_fnRenderer;
  }

  const useChildrenRendererResult = useRenderer(_children, undefined, config);
  const useSimpleRendererResult = useSimpleRenderer(_fnRenderer, config);

  return shouldUseSimpleRendererResult ? useSimpleRendererResult : useChildrenRendererResult;
}
