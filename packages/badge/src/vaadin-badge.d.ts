/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-badge>` is a Web Component for showing information in the form of colored badges.
 *
 * ```
 *  <vaadin-badge>Success</vaadin-badge>
 * ```
 *
 * ### Styling
 *
 * No shadow DOM parts are exposed for styling.
 * 
 * The following `theme` variants are supported: small, success, error, contrast, primary, pill
 *
 * See [Styling Components](hhttps://vaadin.com/docs/latest/components/ds-resources/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
declare class Badge extends ElementMixin(ThemableMixin(PolymerElement)) {
}

export { Badge };
