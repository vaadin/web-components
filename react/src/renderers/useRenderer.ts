import {
  type ComponentType,
  createElement,
  type PropsWithChildren,
  type ReactElement,
  ReactNode,
  useCallback,
  useReducer,
} from 'react';
import { createPortal } from 'react-dom';
import type { Slice, WebComponentRenderer } from './renderer.js';

export type UseRendererResult<W extends WebComponentRenderer> = readonly [
  portals?: ReadonlyArray<ReactElement | null>,
  renderer?: W,
];

const initialState = new Map();

function rendererReducer<W extends WebComponentRenderer>(
  state: Map<HTMLElement, Slice<Parameters<W>, 1>>,
  [root, ...args]: Parameters<W>,
): Map<HTMLElement, Slice<Parameters<W>, 1>> {
  return new Map(state).set(root, args as Slice<Parameters<W>, 1>);
}

export function useRenderer<W extends WebComponentRenderer>(node: ReactNode): UseRendererResult<W>;
export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  reactRenderer: ComponentType<P> | null | undefined,
  convert: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
): UseRendererResult<W>;
export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  reactRendererOrNode: ReactNode | ComponentType<P> | null | undefined,
  convert?: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
): UseRendererResult<W> {
  const [map, update] = useReducer<typeof rendererReducer<W>>(rendererReducer, initialState);
  const renderer = useCallback(((...args: Parameters<W>) => update(args)) as W, []);

  return reactRendererOrNode
    ? [
        Array.from(map.entries()).map(([root, args]) =>
          createPortal(
            convert
              ? createElement<P>(reactRendererOrNode as ComponentType<P>, convert(args))
              : (reactRendererOrNode as ReactNode),
            root,
          ),
        ),
        renderer,
      ]
    : [];
}
