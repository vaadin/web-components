/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-panel>` is a layout for a view, with a header, a scrollable content area
 * and a footer. The default ARIA role is `region`, labelled by the title.
 *
 * ```html
 * <vaadin-panel header-title="Edit User">
 *   <vaadin-button slot="header-prefix" theme="tertiary" aria-label="Close">×</vaadin-button>
 *   <vaadin-button slot="header-suffix" theme="tertiary">Cancel</vaadin-button>
 *   <vaadin-button slot="header-suffix" theme="primary">Save</vaadin-button>
 *   <form>...</form>
 *   <vaadin-button slot="footer">Delete</vaadin-button>
 * </vaadin-panel>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `header`  | The container for the header prefix, title and header suffix.
 * `content` | The scrollable container for the content.
 * `footer`  | The container for the footer elements.
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|-------------
 * `has-title`         | Set when the panel has a title.
 * `has-header-prefix` | Set when the panel has a header prefix.
 * `has-header-suffix` | Set when the panel has header suffix elements.
 * `has-footer`        | Set when the panel has footer elements.
 * `overflow`          | Set to `top`, `bottom`, `start`, `end`, all of them, or none, when the content overflows.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property        |
 * :--------------------------|
 * | `--vaadin-panel-gap`     |
 * | `--vaadin-panel-padding` |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Panel extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The title of the panel. When set, a heading element is rendered in the
   * `title` slot. A custom slotted title takes precedence over this property.
   *
   * @attr {string} header-title
   */
  headerTitle: string;

  /**
   * The heading level (`aria-level`) of the generated title. Defaults to 2.
   * Setting values outside the range [1, 6] can cause accessibility issues.
   *
   * @attr {number} heading-level
   */
  headingLevel: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-panel': Panel;
  }
}

export { Panel };
