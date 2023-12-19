import type { ComponentType, PropsWithChildren } from 'react';
import type { Slice } from './renderer.js';
import { useRenderer, type RendererConfig, type UseRendererResult } from './useRenderer.js';

export type ReactSimpleRendererProps<O extends HTMLElement> = Readonly<{
  original: O;
}>;
export type WebComponentSimpleRenderer<O extends HTMLElement> = (root: HTMLElement, original: O) => void;

function convertSimpleRendererArgs<O extends HTMLElement>([original]: Slice<
  Parameters<WebComponentSimpleRenderer<O>>,
  1
>): PropsWithChildren<ReactSimpleRendererProps<O>> {
  return { original };
}

export function useSimpleRenderer<O extends HTMLElement>(
  reactRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null,
  config?: RendererConfig,
): UseRendererResult<WebComponentSimpleRenderer<O>> {
  return useRenderer(reactRenderer, convertSimpleRendererArgs, config);
}
