import {
  createComponent as _createComponent,
  EventName,
  WebComponentProps as _WebComponentProps,
  ReactWebComponent as _ReactWebComponent,
} from '@lit-labs/react';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type React from 'react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// TODO: Remove when types from @lit-labs/react are exported
export type EventNames = Record<string, EventName | string>;
type Constructor<T> = { new (): T; name: string };
type PolymerConstructor<T> = Constructor<T> & { _properties: Record<string, unknown> };
type Options<I extends HTMLElement, E extends EventNames = {}> = Readonly<{
  displayName?: string;
  elementClass: Constructor<I> | PolymerConstructor<I>;
  events?: E;
  react: typeof window.React;
  tagName: string;
}>;

export type ThemedWebComponentProps<
  I extends ThemePropertyMixinClass & HTMLElement,
  E extends EventNames = {},
> = Partial<Omit<_WebComponentProps<I, E>, 'theme'>> & {
  /**
   * Remove the deprecation warning for React components. In our case, the
   * property is deprecated in favor of an attribute. However, for React, it
   * does not matter if an attribute or a property is set; the same algorithm
   * will be used.
   *
   * @see ThemePropertyMixinClass#theme
   */
  theme?: string;
};

export type WebComponentProps<I extends HTMLElement, E extends EventNames = {}> = I extends ThemePropertyMixinClass
  ? ThemedWebComponentProps<I, E>
  : _WebComponentProps<I, E>;

/** @deprecated */
export type ThemedReactWebComponent<
  I extends ThemePropertyMixinClass & HTMLElement,
  E extends EventNames = {},
> = ForwardRefExoticComponent<ThemedWebComponentProps<I, E> & RefAttributes<I>>;

// We need a separate declaration here; otherwise, the TypeScript fails into the
// endless loop trying to resolve the typings.
export function createComponent<I extends HTMLElement, E extends EventNames = {}>(
  options: Options<I, E>,
): (props: WebComponentProps<I, E> & RefAttributes<I>) => React.ReactElement | null;
export function createComponent<I extends HTMLElement, E extends EventNames = {}>(options: Options<I, E>): any {
  const { elementClass } = options;

  return _createComponent(
    '_properties' in elementClass
      ? {
          ...options,
          // TODO: improve or remove the Polymer workaround
          // 'createComponent' relies on key presence on the custom element class,
          // but Polymer defines properties on the prototype when the first element
          // is created. Workaround: pass a mock object with properties in
          // the prototype.
          elementClass: {
            // @ts-expect-error: it is a specific workaround for Polymer classes.
            name: elementClass.name,
            prototype: elementClass._properties,
          },
        }
      : options,
  );
}
