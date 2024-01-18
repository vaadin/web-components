import {
  type ComponentType,
  createElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useCallback,
  useReducer,
} from 'react';
import { createPortal, flushSync } from 'react-dom';
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

export type RendererConfig = {
  renderSync?: boolean;
};

export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  node: ReactNode,
  convert?: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
  config?: RendererConfig,
): UseRendererResult<W>;
export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  reactRenderer: ComponentType<P> | null | undefined,
  convert: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
  config?: RendererConfig,
): UseRendererResult<W>;
export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  reactRendererOrNode: ReactNode | ComponentType<P> | null | undefined,
  convert?: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
  config?: RendererConfig,
): UseRendererResult<W> {
  const [map, update] = useReducer<typeof rendererReducer<W>>(rendererReducer, initialState);
  const renderer = useCallback(
    ((...args: Parameters<W>) => {
      if (config?.renderSync) {
        // The web components may request multiple synchronous renderer calls that
        // would result in flushSync logging a warning (and actually executing the
        // overlapping flushSync in microtask timing). Suppress the warning and allow
        // the resulting asynchronicity.
        const console = globalThis.console as any;
        const error = console.error;
        console.error = (message: string) => {
          if (message.includes('flushSync')) {
            return;
          }
          error(message);
        };
        flushSync(() => update(args));
        console.error = error;
      } else {
        update(args);
      }
    }) as W,
    [],
  );

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
