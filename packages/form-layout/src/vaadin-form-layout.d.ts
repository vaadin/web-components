/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { FormLayoutMixin } from './vaadin-form-layout-mixin.js';

export * from './vaadin-form-layout-mixin.js';

/**
 * `<vaadin-form-layout>` is a Web Component providing configurable responsive
 * layout for form elements.
 *
 * ```html
 * <vaadin-form-layout>
 *
 *   <vaadin-form-item>
 *     <label slot="label">First Name</label>
 *     <input class="full-width" value="Jane">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Last Name</label>
 *     <input class="full-width" value="Doe">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Email</label>
 *     <input class="full-width" value="jane.doe@example.com">
 *   </vaadin-form-item>
 *
 * </vaadin-form-layout>
 * ```
 *
 * It supports any child elements as layout items.
 *
 * By default, it makes a layout of two columns if the element width is equal or
 * wider than 40em, and a single column layout otherwise.
 *
 * The number of columns and the responsive behavior are customizable with
 * the `responsiveSteps` property.
 *
 * ### Spanning Items on Multiple Columns
 *
 * You can use `colspan` or `data-colspan` attribute on the items.
 * In the example below, the first text field spans on two columns:
 *
 * ```html
 * <vaadin-form-layout>
 *
 *   <vaadin-form-item colspan="2">
 *     <label slot="label">Address</label>
 *     <input class="full-width">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">First Name</label>
 *     <input class="full-width" value="Jane">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Last Name</label>
 *     <input class="full-width" value="Doe">
 *   </vaadin-form-item>
 *
 * </vaadin-form-layout>
 * ```
 *
 * ### Explicit New Row
 *
 * Use the `<br>` line break element to wrap the items on a new row:
 *
 * ```html
 * <vaadin-form-layout>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Email</label>
 *     <input class="full-width">
 *   </vaadin-form-item>
 *
 *   <br>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Confirm Email</label>
 *     <input class="full-width">
 *   </vaadin-form-item>
 *
 * </vaadin-form-layout>
 * ```
 *
 * ### Auto Responsive Mode
 *
 * To avoid manually dealing with responsive breakpoints, Form Layout provides an auto-responsive mode
 * that automatically creates and adjusts fixed-width columns based on the container's available space.
 *
 * The [`columnWidth`](#/elements/vaadin-form-layout#property-columnWidth) and
 * [`maxColumns`](#/elements/vaadin-form-layout#property-maxColumns) properties define the width of
 * each column and the maximum number of columns that the component can create. By default, the component
 * creates up to 10 columns, each with a width of `12em` or the value of the `--vaadin-field-default-width`
 * CSS custom property, if defined.
 *
 * The auto-responsive mode is disabled by default. To enable it for an individual instance, set the
 * `auto-responsive` attribute:
 *
 * ```html
 * <vaadin-form-layout auto-responsive>
 *   <vaadin-text-field label="First Name"></vaadin-text-field>
 *   <vaadin-text-field label="Last Name"></vaadin-text-field>
 *   <vaadin-text-area label="Address" colspan="2"></vaadin-text-area>
 * </vaadin-form-layout>
 * ```
 *
 * You can also enable it for all instances by enabling the following feature flag
 * before `<vaadin-form-layout>` elements are added to the DOM:
 *
 * ```js
 * window.Vaadin.featureFlags.defaultAutoResponsiveFormLayout = true;
 * ```
 *
 * #### Organizing Fields into Rows
 *
 * By default, each field is placed on a new row. To organize fields into rows, you can either:
 *
 * 1. Manually wrap fields into [`<vaadin-form-row>`](#/elements/vaadin-form-row) elements.
 *
 * 2. Enable the [`autoRows`](#/elements/vaadin-form-layout#property-autoRows) property to
 *    let Form Layout automatically arrange fields in available columns, wrapping to a new
 *    row when necessary. `<br>` elements can be used to force a new row.
 *
 * Here is an example of using `<vaadin-form-row>`:
 *
 * ```html
 * <vaadin-form-layout auto-responsive>
 *   <vaadin-form-row>
 *     <vaadin-text-field label="First Name"></vaadin-text-field>
 *     <vaadin-text-field label="Last Name"></vaadin-text-field>
 *   </vaadin-form-row>
 *   <vaadin-form-row>
 *     <vaadin-text-area label="Address" colspan="2"></vaadin-text-area>
 *   </vaadin-form-row>
 * </vaadin-form-layout>
 * ```
 *
 * #### Expanding Columns and Fields
 *
 * You can configure Form Layout to expand columns to evenly fill any remaining space after
 * all fixed-width columns have been created.
 * To enable this, set the [`expandColumns`](#/elements/vaadin-form-layout#property-expandColumns)
 * property to `true`.
 *
 * Also, Form Layout can stretch fields to make them take up all available space within columns.
 * To enable this, set the [`expandFields`](#/elements/vaadin-form-layout#property-expandFields)
 * property to `true`.
 *
 * #### Customizing Label Position
 *
 * By default, Form Layout displays labels above the fields. To position labels beside fields, you
 * need to wrap each field in a `<vaadin-form-item>` element and define its labels on the wrapper.
 * Then, you can enable the [`labelsAside`](#/elements/vaadin-form-layout#property-labelsAside)
 * property:
 *
 * ```html
 * <vaadin-form-layout auto-responsive labels-aside>
 *   <vaadin-form-row>
 *     <vaadin-form-item>
 *       <label slot="label">First Name</label>
 *       <vaadin-text-field></vaadin-text-field>
 *    </vaadin-form-item>
 *    <vaadin-form-item>
 *      <label slot="label">Last Name</label>
 *       <vaadin-text-field></vaadin-text-field>
 *     </vaadin-form-item>
 *   </vaadin-form-row>
 *   <vaadin-form-row>
 *     <vaadin-form-item colspan="2">
 *       <label slot="label">Address</label>
 *       <vaadin-text-area></vaadin-text-area>
 *     </vaadin-form-item>
 *   </vaadin-form-row>
 * </vaadin-form-layout>
 * ```
 *
 * With this, FormLayout will display labels beside fields, falling back to
 * the default position above the fields only when there isn't enough space.
 *
 * ### CSS Properties Reference
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property | Description | Default
 * ---|---|---
 * `--vaadin-form-layout-column-spacing` | Length of the spacing between columns | `2em`
 * `--vaadin-form-layout-row-spacing` | Length of the spacing between rows | `1em`
 * `--vaadin-form-layout-label-width` | Width of the label when labels are displayed aside | `8em`
 * `--vaadin-form-layout-label-spacing` | Length of the spacing between the label and the input when labels are displayed aside | `1em`
 */
declare class FormLayout extends FormLayoutMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-form-layout': FormLayout;
  }
}

export { FormLayout };
