/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { AutoResponsiveLayout } from './layouts/auto-responsive-layout.js';
import { ResponsiveStepsLayout } from './layouts/responsive-steps-layout.js';
import { formLayoutSlotStyles } from './styles/vaadin-form-layout-base-styles.js';

/**
 * @polymerMixin
 * @mixes SlotStylesMixin
 */
export const FormLayoutMixin = (superClass) =>
  class extends SlotStylesMixin(superClass) {
    static get properties() {
      return {
        /**
         * @typedef FormLayoutResponsiveStep
         * @type {object}
         * @property {string} minWidth - The threshold value for this step in CSS length units.
         * @property {number} columns - Number of columns. Only natural numbers are valid.
         * @property {string} labelsPosition - Labels position option, valid values: `"aside"` (default), `"top"`.
         */

        /**
         * Allows specifying a responsive behavior with the number of columns
         * and the label position depending on the layout width.
         *
         * Format: array of objects, each object defines one responsive step
         * with `minWidth` CSS length, `columns` number, and optional
         * `labelsPosition` string of `"aside"` or `"top"`. At least one item is required.
         *
         * NOTE: Responsive steps are ignored in auto-responsive mode, which may be
         * enabled explicitly via the `autoResponsive` property or implicitly
         * if the following feature flag is set:
         *
         * ```js
         * window.Vaadin.featureFlags.defaultAutoResponsiveFormLayout = true
         * ```
         *
         * #### Examples
         *
         * ```javascript
         * formLayout.responsiveSteps = [{columns: 1}];
         * // The layout is always a single column, labels aside.
         * ```
         *
         * ```javascript
         * formLayout.responsiveSteps = [
         *   {minWidth: 0, columns: 1},
         *   {minWidth: '40em', columns: 2}
         * ];
         * // Sets two responsive steps:
         * // 1. When the layout width is < 40em, one column, labels aside.
         * // 2. Width >= 40em, two columns, labels aside.
         * ```
         *
         * ```javascript
         * formLayout.responsiveSteps = [
         *   {minWidth: 0, columns: 1, labelsPosition: 'top'},
         *   {minWidth: '20em', columns: 1},
         *   {minWidth: '40em', columns: 2}
         * ];
         * // Default value. Three responsive steps:
         * // 1. Width < 20em, one column, labels on top.
         * // 2. 20em <= width < 40em, one column, labels aside.
         * // 3. Width >= 40em, two columns, labels aside.
         * ```
         *
         * @type {!Array<!FormLayoutResponsiveStep>}
         */
        responsiveSteps: {
          type: Array,
          value() {
            return [
              { minWidth: 0, columns: 1, labelsPosition: 'top' },
              { minWidth: '20em', columns: 1 },
              { minWidth: '40em', columns: 2 },
            ];
          },
          observer: '__responsiveStepsChanged',
          sync: true,
        },

        /**
         * When set to `true`, the component automatically creates and adjusts columns based on
         * the container's width. Columns have a fixed width defined by `columnWidth` and their
         * number increases up to the limit set by `maxColumns`. The component dynamically adjusts
         * the number of columns as the container size changes. When this mode is enabled,
         * `responsiveSteps` are ignored.
         *
         * By default, each field is placed on a new row. To organize fields into rows, there are
         * two options:
         *
         * 1. Use `<vaadin-form-row>` to explicitly group fields into rows.
         *
         * 2. Enable the `autoRows` property to automatically arrange fields in available columns,
         *    wrapping to a new row when necessary. `<br>` elements can be used to force a new row.
         *
         * The auto-responsive mode is disabled by default. To enable it for an individual instance,
         * use this property. Alternatively, if you want it to be enabled for all instances by default,
         * enable the `defaultAutoResponsiveFormLayout` feature flag before `<vaadin-form-layout>`
         * elements are added to the DOM:
         *
         * ```js
         * window.Vaadin.featureFlags.defaultAutoResponsiveFormLayout = true;
         * ```
         *
         * @attr {boolean} auto-responsive
         */
        autoResponsive: {
          type: Boolean,
          sync: true,
          value: () => {
            if (
              window.Vaadin &&
              window.Vaadin.featureFlags &&
              window.Vaadin.featureFlags.defaultAutoResponsiveFormLayout
            ) {
              return true;
            }

            return false;
          },
          reflectToAttribute: true,
        },

        /**
         * When `autoResponsive` is enabled, defines the width of each column.
         * The value must be defined in CSS length units, e.g. `100px`.
         *
         * If the column width isn't explicitly set, it defaults to `12em`
         * or `--vaadin-field-default-width` if that CSS property is defined.
         *
         * @attr {string} column-width
         */
        columnWidth: {
          type: String,
          sync: true,
        },

        /**
         * When `autoResponsive` is enabled, defines the maximum number of columns
         * that the layout can create. The layout will create columns up to this
         * limit based on the available container width.
         *
         * The default value is `10`.
         *
         * @attr {number} max-columns
         */
        maxColumns: {
          type: Number,
          sync: true,
          value: 10,
        },

        /**
         * When `autoResponsive` is enabled, defines the minimum number of columns
         * that the layout can create. The layout will create columns at least up
         * to this limit.
         *
         * The default value is `1`.
         *
         * @attr {number} min-columns
         */
        minColumns: {
          type: Number,
          sync: true,
          value: 1,
        },

        /**
         * When enabled with `autoResponsive`, distributes fields across columns
         * by placing each field in the next available column and wrapping to
         * the next row when the current row is full. `<br>` elements can be
         * used to force a new row.
         *
         * The default value is `false`.
         *
         * @attr {boolean} auto-rows
         */
        autoRows: {
          type: Boolean,
          sync: true,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * When enabled with `autoResponsive`, `<vaadin-form-item>` prefers positioning
         * labels beside the fields. If the layout is too narrow to fit a single column
         * with a side label, the component will automatically switch labels to their
         * default position above the fields.
         *
         * The default value is `false`.
         *
         * To customize the label width and the gap between the label and the field,
         * use the following CSS properties:
         *
         * - `--vaadin-form-layout-label-width`
         * - `--vaadin-form-layout-label-spacing`
         *
         * @attr {boolean} labels-aside
         */
        labelsAside: {
          type: Boolean,
          sync: true,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * When `autoResponsive` is enabled, specifies whether the columns should expand
         * in width to evenly fill any remaining space after all columns have been created.
         *
         * The default value is `false`.
         *
         * @attr {boolean} expand-columns
         */
        expandColumns: {
          type: Boolean,
          sync: true,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * When `autoResponsive` is enabled, specifies whether fields should stretch
         * to take up all available space within columns. This setting also applies
         * to fields inside `<vaadin-form-item>` elements.
         *
         * The default value is `false`.
         *
         * @attr {boolean} expand-fields
         */
        expandFields: {
          type: Boolean,
          sync: true,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    static get observers() {
      return [
        '__autoResponsiveLayoutPropsChanged(columnWidth, maxColumns, minColumns, autoRows, labelsAside, expandColumns, expandFields)',
        '__autoResponsiveChanged(autoResponsive)',
      ];
    }

    constructor() {
      super();

      /** @type {import('./layouts/abstract-layout.js').AbstractLayout} */
      this.__currentLayout;

      this.__autoResponsiveLayout = new AutoResponsiveLayout(this);
      this.__responsiveStepsLayout = new ResponsiveStepsLayout(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      this.__currentLayout.connect();
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__currentLayout.disconnect();
    }

    /** @protected */
    get slotStyles() {
      return [`${formLayoutSlotStyles}`.replace('vaadin-form-layout', this.localName)];
    }

    /** @protected */
    _updateLayout() {
      this.__currentLayout.updateLayout();
    }

    /** @private */
    __responsiveStepsChanged(responsiveSteps, oldResponsiveSteps) {
      try {
        this.__responsiveStepsLayout.setProps({ responsiveSteps });
      } catch (e) {
        if (oldResponsiveSteps && oldResponsiveSteps !== responsiveSteps) {
          console.warn(`${e.message} Using previously set 'responsiveSteps' instead.`);
          this.responsiveSteps = oldResponsiveSteps;
        } else {
          console.warn(`${e.message} Using default 'responsiveSteps' instead.`);
          this.responsiveSteps = [
            { minWidth: 0, columns: 1, labelsPosition: 'top' },
            { minWidth: '20em', columns: 1 },
            { minWidth: '40em', columns: 2 },
          ];
        }
      }
    }

    /** @private */
    // eslint-disable-next-line @typescript-eslint/max-params
    __autoResponsiveLayoutPropsChanged(
      columnWidth,
      maxColumns,
      minColumns,
      autoRows,
      labelsAside,
      expandColumns,
      expandFields,
    ) {
      this.__autoResponsiveLayout.setProps({
        columnWidth,
        maxColumns,
        minColumns,
        autoRows,
        labelsAside,
        expandColumns,
        expandFields,
      });
    }

    /** @private */
    __autoResponsiveChanged(autoResponsive) {
      if (this.__currentLayout) {
        this.__currentLayout.disconnect();
      }

      if (autoResponsive) {
        this.__currentLayout = this.__autoResponsiveLayout;
      } else {
        this.__currentLayout = this.__responsiveStepsLayout;
      }

      this.__currentLayout.connect();
    }
  };
