/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { formSectionStyles } from './vaadin-form-layout-styles.js';
import { FormSectionMixin } from './vaadin-form-section-mixin.js';

registerStyles('vaadin-form-section', formSectionStyles, { moduleId: 'vaadin-form-section-styles' });

/*
 * @customElement
 * @extends HTMLElement
 * @mixes FormSectionMixin
 * @mixes ThemableMixin
 */
class FormSection extends FormSectionMixin(ThemableMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-form-section';
  }

  static get template() {
    return html`
      <div part="header" id="header">
        <h2 part="title" id="title"></h2>
      </div>
      <slot></slot>
    `;
  }
}

defineCustomElement(FormSection);

export { FormSection };
