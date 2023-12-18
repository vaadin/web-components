import { createComponent as _createComponent, type EventName } from '@lit/react';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type React from 'react';
import type { RefAttributes } from 'react';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';

declare const __VERSION__: string;

declare global {
  interface VaadinRegistration {
    is: string;
    version: string;
  }

  interface Vaadin {
    registrations?: VaadinRegistration[];
  }

  interface Window {
    // @ts-expect-error: Different declaration from one of the dependencies.
    Vaadin?: Vaadin;
  }
}

window.Vaadin ??= {};
window.Vaadin.registrations ??= [];
window.Vaadin.registrations.push({
  is: '@hilla/react-components',
  version: __VERSION__,
});

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

// A map of expected event listener types based on EventNames.
type EventListeners<R extends EventNames> = {
  [K in keyof R]?: R[K] extends EventName ? (e: R[K]['__eventType']) => void : (e: Event) => void;
};

// Props derived from custom element class. Currently has limitations of making
// all properties optional and also surfaces life cycle methods in autocomplete.
// TODO: LoginOverlay has "autofocus" property, so we add it back manually.
type ElementProps<I> = Partial<Omit<I, keyof HTMLElement>> & { autofocus?: boolean };

// Acceptable props to the React component.
type ComponentProps<I, E extends EventNames = {}> = Omit<
  React.HTMLAttributes<I>,
  // Prefer type of provided event handler props or those on element over
  // built-in HTMLAttributes
  keyof E | keyof ElementProps<I>
> &
  EventListeners<E> &
  ElementProps<I>;

export type ThemedWebComponentProps<
  I extends ThemePropertyMixinClass & HTMLElement,
  E extends EventNames = {},
> = ComponentProps<I, E> & {
  /**
   * Attribute that can be used by the component to apply built-in style variants,
   * or to propagate its value to the sub-components in Shadow DOM.
   *
   * @see ThemePropertyMixinClass#_theme
   */
  theme?: string;
};

type AllWebComponentProps<I extends HTMLElement, E extends EventNames = {}> = I extends ThemePropertyMixinClass
  ? ThemedWebComponentProps<I, E>
  : ComponentProps<I, E>;

export type WebComponentProps<I extends HTMLElement, E extends EventNames = {}> = Omit<
  AllWebComponentProps<I, E>,
  keyof ControllerMixinClass
>;

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
            prototype: { ...elementClass._properties, hidden: Boolean },
          },
        }
      : options,
  );
}
