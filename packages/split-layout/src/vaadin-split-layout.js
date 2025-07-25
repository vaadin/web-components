/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { splitLayoutStyles } from './styles/vaadin-split-layout-core-styles.js';
import { SplitLayoutMixin } from './vaadin-split-layout-mixin.js';

/**
 * `<vaadin-split-layout>` is a Web Component implementing a split layout for two
 * content elements with a draggable splitter between them.
 *
 * ```html
 * <vaadin-split-layout>
 *   <div>First content element</div>
 *   <div>Second content element</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Horizontal and Vertical Layouts
 *
 * By default, the split's orientation is horizontal, meaning that the content elements are
 * positioned side by side in a flex container with a horizontal layout.
 *
 * You can change the split mode to vertical by setting the `orientation` attribute to `"vertical"`:
 *
 * ```html
 * <vaadin-split-layout orientation="vertical">
 *   <div>Content on the top</div>
 *   <div>Content on the bottom</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Layouts Combination
 *
 * For the layout contents, we usually use `<div>` elements in the examples,
 * although you can use any other elements as well.
 *
 * For instance, in order to have a nested vertical split layout inside a
 * horizontal one, you can include `<vaadin-split-layout>` as a content element
 * inside another split layout:
 *
 * ```html
 * <vaadin-split-layout>
 *   <div>First content element</div>
 *   <vaadin-split-layout orientation="vertical">
 *     <div>Second content element</div>
 *     <div>Third content element</div>
 *   </vaadin-split-layout>
 * </vaadin-split-layout>
 * ```
 *
 * You can also trigger the vertical mode in JavaScript by setting the property:
 * `splitLayout.orientation = "vertical";`.
 *
 * ### Split Layout Element Height
 *
 * `<vaadin-split-layout>` element itself is a flex container. It does not inherit
 * the parent height by default, but rather sets its height depending on the
 * content.
 *
 * You can use CSS to set the fixed height for the split layout, as usual with any
 * block element:
 *
 * ```html
 * <vaadin-split-layout style="height: 200px;">
 *   <div>First content element</div>
 *   <div>Second content element</div>
 * </vaadin-split-layout>
 * ```
 *
 * It is possible to define percentage height as well. Note that you have to set
 * the parent height in order to make percentages work correctly. In the following
 * example, the `<body>` is resized to fill the entire viewport, and the
 * `<vaadin-split-layout>` element is set to take 100% height of the `<body>`:
 *
 * ```html
 * <body style="height: 100vh; margin: 0;">
 *   <vaadin-split-layout style="height: 100%;">
 *     <div>First</div>
 *     <div>Second</div>
 *   </vaadin-split-layout>
 * </body>
 * ```
 *
 * Alternatively, you can use a flexbox layout to make `<vaadin-split-layout>`
 * fill up the parent:
 *
 * ```html
 * <body style="height: 100vh; margin: 0; display: flex;">
 *   <vaadin-split-layout style="flex: 1;">
 *     <div>First</div>
 *     <div>Second</div>
 *   </vaadin-split-layout>
 * </body>
 * ```
 *
 * ### Initial Splitter Position
 *
 * The initial splitter position is determined from the sizes of the content elements
 * inside the split layout. Therefore, changing `width` on the content elements
 * affects the initial splitter position for the horizontal layouts, while `height`
 * affects the vertical ones.
 *
 * Note that when the total size of the content elements does not fit the layout,
 * the content elements are scaled proportionally.
 *
 * When setting initial sizes with relative units, such as percentages, it is
 * recommended to assign the size for both content elements:
 *
 * ```html
 * <vaadin-split-layout>
 *   <div style="width: 75%;">Three fourths</div>
 *   <div style="width: 25%;">One fourth</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Size Limits
 *
 * The `min-width`/`min-height`, and `max-width`/`max-height` CSS size values
 * for the content elements are respected and used to limit the splitter position
 * when it is dragged.
 *
 * It is preferred to set the limits only for a single content element, in order
 * to avoid size conflicts:
 *
 * ```html
 * <vaadin-split-layout>
 *   <div style="min-width: 50px; max-width: 150px;">First</div>
 *   <div>Second</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description | Theme for Element
 * ----------------|----------------|----------------
 * `splitter` | Split element | vaadin-split-layout
 * `handle` | The handle of the splitter | vaadin-split-layout
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} splitter-dragend - Fired after dragging the splitter have ended.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes SplitLayoutMixin
 * @mixes ThemableMixin
 */
class SplitLayout extends SplitLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-split-layout';
  }

  static get styles() {
    return splitLayoutStyles;
  }

  /** @protected */
  render() {
    return html`
      <slot id="primary" name="primary"></slot>
      <div part="splitter" id="splitter">
        <div part="handle"></div>
      </div>
      <slot id="secondary" name="secondary"></slot>
    `;
  }

  /**
   * Fired after dragging the splitter have ended.
   *
   * @event splitter-dragend
   */
}

defineCustomElement(SplitLayout);

export { SplitLayout };
