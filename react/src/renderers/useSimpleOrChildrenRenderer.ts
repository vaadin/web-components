import type { ComponentType, ReactNode } from 'react';
import { useRenderer } from "./useRenderer.js";
import type { UseRendererResult } from './useRenderer.js';
import {
  type ReactSimpleRendererProps,
  useSimpleRenderer,
  type WebComponentSimpleRenderer,
} from './useSimpleRenderer.js';

export function useSimpleOrChildrenRenderer<O extends HTMLElement>(
  fnRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null,
  children?: ReactNode,
): UseRendererResult<WebComponentSimpleRenderer<O>> {
  const useChildrenRendererResult = useRenderer(children);
  const useSimpleRendererResult = useSimpleRenderer(fnRenderer);

  return fnRenderer ? useSimpleRendererResult : useChildrenRendererResult;
}
