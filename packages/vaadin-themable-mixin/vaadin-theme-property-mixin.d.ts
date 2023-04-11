/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function ThemePropertyMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<ThemePropertyMixinClass>;

export declare class ThemePropertyMixinClass {
  /**
   * Helper property with theme attribute value facilitating propagation
   * in shadow DOM.
   *
   * Enables the component implementation to propagate the `theme`
   * attribute value to the sub-components in Shadow DOM by binding
   * the sub-component’s "theme" attribute to the `theme` property of
   * the host.
   *
   * **NOTE:** Extending the mixin only provides the property for binding,
   * and does not make the propagation alone.
   *
   * See [Styling Components: Sub-components](https://vaadin.com/docs/latest/ds/customization/styling-components/#sub-components).
   * page for more information.
   */
  readonly theme: string | null | undefined;
}
