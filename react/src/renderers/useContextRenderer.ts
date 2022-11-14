import type { ComponentType } from 'react';
import type { Slice } from './renderer.js';
import { useRenderer, type UseRendererResult } from './useRenderer.js';

export type ReactContextRendererProps<C, O extends HTMLElement> = Readonly<{
  context: C;
  original: O;
}>;

export type WebComponentContextRenderer<C, O extends HTMLElement> = (
  root: HTMLElement,
  original: O,
  context: C,
) => void;

export function convertContextRendererArgs<C, O extends HTMLElement>([original, context]: Slice<
  Parameters<WebComponentContextRenderer<C, O>>,
  1
  >): ReactContextRendererProps<C, O> {
  return { context, original };
}

export function useContextRenderer<C, O extends HTMLElement>(
  reactRenderer?: ComponentType<ReactContextRendererProps<C, O>> | null,
): UseRendererResult<WebComponentContextRenderer<C, O>> {
  return useRenderer(reactRenderer, convertContextRendererArgs);
}
