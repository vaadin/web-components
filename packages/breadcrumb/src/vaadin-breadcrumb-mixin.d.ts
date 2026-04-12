/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common breadcrumb functionality.
 */
export declare function BreadcrumbMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbMixinClass> & T;

export interface BreadcrumbItemDefinition {
  label: string;
  path?: string;
  disabled?: boolean;
}

export interface BreadcrumbI18n {
  overflow?: string;
}

export interface BreadcrumbNavigateEvent {
  path: string;
  current: boolean;
  originalEvent: Event;
}

export declare class BreadcrumbMixinClass {
  /**
   * Callback function for router integration.
   *
   * When a breadcrumb item link is clicked, this function is called and the default click
   * action is cancelled. This delegates the responsibility of navigation to the function's logic.
   *
   * The click event action is not cancelled in the following cases:
   * - The click event has a modifier (e.g. `metaKey`, `shiftKey`)
   * - The click event is on an external link
   * - The click event is on an item with `[router-ignore]` attribute
   * - The function explicitly returns `false`
   *
   * The function receives an object with the properties of the clicked breadcrumb item:
   * - `path`: The path of the breadcrumb item.
   * - `current`: A boolean indicating whether the breadcrumb item is currently selected.
   * - `originalEvent`: The original DOM event that triggered the navigation.
   *
   * Also see the `location` property for updating the current breadcrumb item on route change.
   */
  onNavigate?: ((event: BreadcrumbNavigateEvent) => boolean) | ((event: BreadcrumbNavigateEvent) => void);
  /**
   * A change to this property triggers an update of the current item in the breadcrumb.
   * While it typically corresponds to the browser's URL, the specific value assigned to
   * the property is irrelevant. The component has its own internal logic for determining
   * which item is current.
   *
   * The main use case for this property is when the breadcrumb is used with a client-side
   * router. In this case, the component needs to be informed about route changes so it
   * can update the current item.
   */
  location: unknown;

  /**
   * Programmatic item definition. When set to an array, generates
   * `<vaadin-breadcrumb-item>` elements in light DOM, replacing any
   * previously generated items. When set to `null` or `undefined`,
   * generated items are removed.
   */
  items: BreadcrumbItemDefinition[] | null | undefined;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire `i18n` object with a
   * custom one, providing all expected properties.
   *
   * The object has the following JSON structure and default values:
   * ```
   * {
   *   overflow: 'Show more'
   * }
   * ```
   */
  i18n: BreadcrumbI18n;
}
