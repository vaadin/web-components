import { Component, PureComponent } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { useRenderer } from './useRenderer.js';
import type { UseRendererResult } from './useRenderer.js';
import {
  type ReactSimpleRendererProps,
  useSimpleRenderer,
  type WebComponentSimpleRenderer,
} from './useSimpleRenderer.js';

export function useSimpleOrChildrenRenderer<O extends HTMLElement>(
  fnRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null,
  children?: ReactNode | ComponentType<ReactSimpleRendererProps<O>>,
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

  const useChildrenRendererResult = useRenderer(_children);
  const useSimpleRendererResult = useSimpleRenderer(_fnRenderer);

  return shouldUseSimpleRendererResult ? useSimpleRendererResult : useChildrenRendererResult;
}
